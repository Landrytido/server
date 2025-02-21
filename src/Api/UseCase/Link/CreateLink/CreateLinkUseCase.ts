// src/Api/UseCase/Link/CreateLink/CreateLinkUseCase.ts
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { SaveLinkDto } from "./SaveLinkDto";
import { Link } from "@prisma/client";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import FileRepository from "../../../Repository/FileRepository";
import FileDto from "../../File/FileDto";
import { PuppeteerService } from "../Service/puppeteer.service";
import { S3UploadService } from "../Service/s3-upload.service";
// IMPORTANT: import fs from Node
import { promises as fs } from "fs";
@Injectable()
export default class CreateLinkUseCase
  implements UseCase<Promise<Link>, [dto: SaveLinkDto]>
{
  private readonly logger = new Logger(CreateLinkUseCase.name);
  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly filRepository: FileRepository,
    private readonly puppeteerService: PuppeteerService,
    private readonly s3UploadService: S3UploadService
  ) {}
  async handle(
    context: ContextualGraphqlRequest,
    dto: SaveLinkDto
  ): Promise<Link> {
    let screenshotPath: string | null = null;
    try {
      // (1) Log the URL
      this.logger.log(`About to capture screenshot for URL: ${dto.url}`);
      // 1) Take a local screenshot
      screenshotPath = await this.puppeteerService.captureScreenshot(dto.url);
      this.logger.log(`Screenshot captured => ${screenshotPath}`);
      // 2) Upload to S3 (Scaleway)
      const timestamp = Date.now();
      const fileName = `screenshot_${timestamp}.png`;
      this.logger.log(`Uploading to S3 => ${fileName}`);
      const uploadedUrl = await this.s3UploadService.uploadFile(
        screenshotPath,
        fileName
      );
      this.logger.log(`Final URL => ${uploadedUrl}`);
      // (NEW) Delete local file after successful upload
      await fs.unlink(screenshotPath);
      this.logger.log(`Deleted local file => ${screenshotPath}`);
      screenshotPath = null;
      // 3) Create the File object in DB
      const fileDto: FileDto = {
        filename: fileName,
        initialFilename: fileName,
        path: "mywebcompanion", // or whatever path you want in your DB
        uri: uploadedUrl,
      };
      const savedFile = await this.filRepository.saveFile(fileDto);
      if (!savedFile || !savedFile.id) {
        throw new BadRequestException("File saving failed");
      }
      // 4) Associate the file with the link
      const linkDto: SaveLinkDto = {
        ...dto,
        imageId: savedFile.id, // associate the image
      };
      // 5) Create the link
      const link = await this.linkRepository.save(context.userId, linkDto);
      this.logger.log(`Link created => ${JSON.stringify(link)}`);
      return link;
    } catch (error) {
      // If an error occurs, optionally delete the local file if it still exists
      if (screenshotPath) {
        try {
          await fs.unlink(screenshotPath);
          this.logger.warn(
            `Deleted local file due to error => ${screenshotPath}`
          );
        } catch (unlinkError) {
          this.logger.error(
            `Failed to delete local file after error`,
            unlinkError.stack
          );
        }
      }
      this.logger.error(
        `Failed to create link with screenshot`,
        (error as Error).stack
      );
      throw new BadRequestException(
        "Failed to create link with screenshot",
        (error as Error).message
      );
    }
  }
}
