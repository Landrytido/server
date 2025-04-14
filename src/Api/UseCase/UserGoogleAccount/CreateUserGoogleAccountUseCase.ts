import { BadRequestException, Injectable } from "@nestjs/common";
import { ContextualGraphqlRequest } from "../../../index";
import UserGoogleAccountRepository from "../../Repository/UserGoogleAccount/UserGoogleAccountRepository";
import UserRepository from "../../Repository/UserRepository";
import { UserGoogleAccount } from "@prisma/client";
import { CreateUserGoogleAccountDto } from "../../Dto/UserGoogleAccountDto/CreateUserGoogleAccountDto";
import axios from "axios";

@Injectable()
export default class CreateUserGoogleAccountUseCase {
  constructor(
    private readonly userGoogleAccountRepository: UserGoogleAccountRepository,
    private readonly userRepository: UserRepository
  ) {}

  async handle(
    context: ContextualGraphqlRequest,
    dto: CreateUserGoogleAccountDto
  ): Promise<UserGoogleAccount> {
    if (!this.isGoogleEmail(dto.email)) {
      throw new BadRequestException(
        "L'adresse email doit être un email Google valide (@gmail.com)"
      );
    }

    const existingAccount =
      await this.userGoogleAccountRepository.findByUserIdAndEmail(
        context.userId,
        dto.email
      );

    if (existingAccount) {
      throw new BadRequestException("Ce compte Google est déjà ajouté");
    }

    // Vérifier si c'est le premier compte ajouté
    const existingAccounts =
      await this.userGoogleAccountRepository.findByUserId(context.userId);

    // Si aucun compte n'existe encore et que l'utilisateur a un token Google principal
    if (existingAccounts.length === 0) {
      const user = await this.userRepository.findById(context.userId);

      // Si l'utilisateur a un token Google principal
      if (user.googleAccessToken) {
        try {
          // Récupérer l'email du compte principal via l'API Google
          const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${user.googleAccessToken}`,
              },
            }
          );

          if (response.data && response.data.email) {
            const primaryEmail = response.data.email;

            // Si l'email du compte principal est différent du nouveau compte
            if (primaryEmail !== dto.email) {
              // Migrer le compte principal vers UserGoogleAccount
              await this.userGoogleAccountRepository.create(
                context.userId,
                primaryEmail,
                user.googleAccessToken,
                user.googleRefreshToken || null,
                true // Définir comme compte par défaut
              );

              // Le nouveau compte ne sera pas le compte par défaut
              // sauf si explicitement demandé
              if (dto.isDefault === undefined) {
                dto.isDefault = false;
              }
            }
          }
        } catch (error) {
          // Continuer avec l'ajout du nouveau compte même en cas d'erreur
        }
      }
    }

    // Ajouter le nouveau compte comme prévu
    return this.userGoogleAccountRepository.create(
      context.userId,
      dto.email,
      dto.accessToken,
      dto.refreshToken || null,
      dto.isDefault
    );
  }

  private isGoogleEmail(email: string): boolean {
    return (
      email.endsWith("@gmail.com") ||
      email.endsWith("@googlemail.com") ||
      email.endsWith("@google.com")
    );
  }
}
