import { BadRequestException, Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { SaveLinkDto } from "./SaveLinkDto";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import SaveFileUseCase from "../../File/SaveFile/SaveFileUseCase";
import FileDto from "../../File/FileDto";
import FileRepository from "../../../Repository/FileRepository";

@Injectable()
export default class CreateLinkUseCase
    implements UseCase<Promise<Link>, [dto: SaveLinkDto]>
{
  constructor(
      private readonly linkRepository: LinkRepository,
      private readonly filRepository: FileRepository
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveLinkDto): Promise<Link> {
    try {
      // Création et enregistrement du fichier
      const fileDto: FileDto = {
        filename: "default_filename",
        initialFilename: "default_initial_filename",
        path: "path",
        uri: dto.url
      };

      const savedFile = await this.filRepository.saveFile(fileDto);
      console.log(savedFile);
      if (!savedFile || !savedFile.id) {
        throw new BadRequestException("File saving failed");
      }

      // Mise à jour du SaveLinkDto avec l'image ID
      const linkDto: SaveLinkDto = {
        ...dto,
        imageId: savedFile.id,
      };

      // Enregistrement du lien
      const link = await this.linkRepository.save(context.userId, linkDto);

      return link;
    } catch (error) {
      throw new BadRequestException("Failed to create link", error.message);
    }
  }
}
