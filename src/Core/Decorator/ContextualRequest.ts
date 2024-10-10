import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ContextualGraphqlRequest } from "../../index";

// Décorateur personnalisé pour obtenir le contexte GraphQL
export const ContextualRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): ContextualGraphqlRequest => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req; // Récupération de la requête

    // Récupération des en-têtes de la requête
    const headers = { ...request.headers };
    
    // Suppression de l'autorisation des en-têtes
    delete headers.authorization;

    // Retourne l'utilisateur et les en-têtes de la requête
    return {
      ...request.user, // Ajoute les informations de l'utilisateur
      request: { headers } // Retourne les en-têtes modifiés
    };
  }
);
