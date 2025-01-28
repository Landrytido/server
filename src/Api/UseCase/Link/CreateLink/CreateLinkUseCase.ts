// src/Api/UseCase/Link/CreateLink/CreateLinkUseCase.ts

import { BadRequestException, Injectable } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { SaveLinkDto } from "./SaveLinkDto";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import FileRepository from "../../../Repository/FileRepository";
import FileDto from "../../File/FileDto";
import { PuppeteerService } from "../Service/puppeteer.service";
import { S3UploadService } from "../Service/s3-upload.service";

@Injectable()
export default class CreateLinkUseCase
  implements UseCase<Promise<Link>, [dto: SaveLinkDto]>
{
  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly filRepository: FileRepository,
    private readonly puppeteerService: PuppeteerService,
    private readonly s3UploadService: S3UploadService,
  ) {}

  async handle(context: ContextualGraphqlRequest, dto: SaveLinkDto): Promise<Link> {
    try {
      // (1) Log l'URL
      console.log("CreateLinkUseCase: About to capture screenshot for URL:", dto.url);

      // 1) Prendre le screenshot local
      const screenshotPath = await this.puppeteerService.captureScreenshot(dto.url);
      console.log("CreateLinkUseCase: Screenshot captured =>", screenshotPath);

      // 2) Uploader dans S3 (Scaleway)
      const timestamp = Date.now();
      const fileName = `screenshot_${timestamp}.png`;
      console.log("CreateLinkUseCase: Uploading to S3 =>", fileName);

      const uploadedUrl = await this.s3UploadService.uploadFile(screenshotPath, fileName);
      console.log("CreateLinkUseCase: Final URL =>", uploadedUrl);

      // 3) Créer l'objet File dans votre DB
      const fileDto: FileDto = {
        filename: fileName,
        initialFilename: fileName,
        path: "mywebcompanion", // ou ce que vous voulez en DB
        uri: uploadedUrl,
      };
      const savedFile = await this.filRepository.saveFile(fileDto);

      if (!savedFile || !savedFile.id) {
        throw new BadRequestException("File saving failed");
      }

      // 4) Associer le fichier au lien
      const linkDto: SaveLinkDto = {
        ...dto,
        imageId: savedFile.id, // associe l'image
      };

      // 5) Créer le lien
      const link = await this.linkRepository.save(context.userId, linkDto);
      console.log("CreateLinkUseCase: Link created =>", link);

      return link;
    } catch (error) {
      console.error("CreateLinkUseCase error:", error); 
      throw new BadRequestException(
        "Failed to create link with screenshot",
        error.message,
      );
    }
  }
}
