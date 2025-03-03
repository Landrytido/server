import { Module } from "@nestjs/common";
import CommentResolver from "../../Resolver/CommentResolver";
import CreateCommentUseCase from "./CreateComment/CreateCommentUseCase"; // Assurez-vous que le chemin est correct
import DeleteCommentUseCase from "./DeleteComment/DeleteCommentUseCase"; // Créez ce fichier si nécessaire
import UpdateCommentUseCase from "./UpdateComment/UpdateCommentUseCase"; // Ajoutez l'importation ici
import CommentService from "./CommentService"; // Assurez-vous que le chemin est correct
import UseCaseFactory from "../UseCaseFactory";
import FindCommentByNoteIdUseCase from "./FindCommentByNoteId/FindCommentByNoteIdUseCase";

@Module({
  providers: [
    CommentResolver, // Résolveur pour gérer les mutations liées aux commentaires
    CreateCommentUseCase, // Cas d'utilisation pour créer un commentaire
    DeleteCommentUseCase, // Cas d'utilisation pour supprimer un commentaire (ajouté ici)
    UpdateCommentUseCase, // Cas d'utilisation pour mettre à jour un commentaire (ajouté ici)
    UseCaseFactory, // Usine pour les cas d'utilisation
    CommentService, // Service pour la logique métier des commentaires
    FindCommentByNoteIdUseCase,
  ],
  exports: [CommentResolver], // Exportez le resolver si nécessaire
})
export default class CommentModule {}
