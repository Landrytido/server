import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import LinkRepository from "../../../Repository/LinkRepository";
import { ContextualGraphqlRequest, UseCase } from "../../../../index";
import InsufficientPermissionException from "../../../../Core/Exception/InsufficientPermissionException";
import { S3UploadService } from "../Service/s3-upload.service";
import { PrismaService } from "src/Core/Datasource/Prisma";

@Injectable()
export default class DeleteLinkUseCase
  implements UseCase<Promise<boolean>, [id: number]>
{
  constructor(
    private readonly linkRepository: LinkRepository,
    private readonly s3UploadService: S3UploadService,
    private readonly prisma: PrismaService,
  ) {}

  async handle(context: ContextualGraphqlRequest, id: number): Promise<boolean> {
    try {
      const link = await this.linkRepository.findById(id);
      if (!link) {
        throw new NotFoundException(`Link not found with id = ${id}`);
      }

      if (link.userId !== context.userId) {
        throw new InsufficientPermissionException(
          `Access denied: User #${context.userId} cannot delete link #${id} owned by #${link.userId}.`
        );
      }

      if (link.imageId) {
        const file = await this.prisma.file.findUnique({
          where: { id: link.imageId },
        });
        if (file && file.uri) {
          const fileKey = file.uri.split("/").slice(-1)[0];
          await this.s3UploadService.deleteFile(fileKey);
          await this.prisma.file.delete({
            where: { id: link.imageId },
          });
        }
      }

      await this.prisma.linkClick.deleteMany({
        where: { linkId: link.id },
      });

      await this.linkRepository.delete(id);

      return true;
    } catch (error) {
      throw new BadRequestException("Failed to delete link", error.message);
    }
  }
}
