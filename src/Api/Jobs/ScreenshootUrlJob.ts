import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {PuppeteerService} from "../Services/PupeteerService";
import LinkRepository from "../Repository/Link/LinkRepository";
import FileRepository from "../Repository/FileRepository";
import {S3UploadService} from "../Services/S3UploadService";
import {Link} from "@prisma/client";

@Injectable()
export class ScreenshootUrlJob {
    private readonly logger = new Logger(ScreenshootUrlJob.name);

    constructor(
        private readonly puppeteerService: PuppeteerService,
        private readonly linkRepository: LinkRepository,
        private readonly fileRepository: FileRepository,
        private readonly s3service: S3UploadService,
    ) {
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handle() {
        try {
            const newScreenshoots = await this.takeNewScreenshoot();
            const updatedScreenshoots = await this.updateScreenshoot();

            this.logger.log(`New screenshoots taken : ${newScreenshoots}, updated screenshoots : ${updatedScreenshoots}`);

        } catch (error) {
            this.logger.error(`Error during screenshoots : ${error}`);
        }
    }

    private async captureWebsite(link: Link) {
        const screenshootUrl = await this.puppeteerService.captureScreenshot(link.url);
        const file = await this.fileRepository.saveFile({
            filename: `screenshot_${Date.now()}.png`,
            initialFilename: `screenshot_${Date.now()}.png`,
            path: `screenshots/${Date.now()}.png`,
            uri: screenshootUrl,
        });
        return file;
    }

    async takeNewScreenshoot(): Promise<number> {
        const links = await this.linkRepository.findNotCaptured();
        let count = 0;
        for (const link of links) {
            try {
                const file = await this.captureWebsite(link);
                await this.linkRepository.update(link.id, {
                    url: link.url,
                    ownerId: link.ownerId,
                    imageId: file.id,
                    screenShotAt: new Date(),
                });
            } catch (error) {
                this.logger.error(`Error during screenshoot of ${link.url} : ${error}`);
            }
            count++;
        }
        return count;
    }

    async updateScreenshoot(): Promise<number> {
        const links = await this.linkRepository.findExpiredCaptured();
        let count = 0;
        for (const link of links) {
            try {
                const oldExistingFile = await this.fileRepository.findById(link.imageId)
                this.s3service.deleteFile(oldExistingFile.uri.split('/').pop());
                const fileToDelete = await this.fileRepository.delete(oldExistingFile.id);
                this.logger.log(`File deleted : ${fileToDelete.uri}`);
                // update
                const file = await this.captureWebsite(link);
                await this.linkRepository.update(link.id, {
                    url: link.url,
                    ownerId: link.ownerId,
                    imageId: file.id,
                    screenShotAt: new Date(),
                });
            } catch (error) {
                this.logger.error(`Error during screenshoot of ${link.url} : ${error}`);
            }
            count++;
        }
        return count;
    }
}
