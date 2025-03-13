import {Injectable, Logger} from "@nestjs/common";
import * as puppeteer from "puppeteer";
import {promises as fs} from "fs";
import * as path from "path";
import {S3UploadService} from "./S3UploadService";

@Injectable()
export class PuppeteerService {
    private readonly logger = new Logger(PuppeteerService.name);
    private readonly s3service = new S3UploadService();

    public async captureScreenshot(url: string): Promise<string> {
        try {
            const timestamp = Date.now();
            const filename = `screenshot_${timestamp}.png`;
            const localFilePath = path.join(process.cwd(), "screenshots", filename);

            // Crée le dossier "screenshots" s'il n'existe pas
            await fs.mkdir(path.dirname(localFilePath), {recursive: true});

            const browser = await puppeteer.launch({
                headless: true,
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                ],
            });
            const page = await browser.newPage();

            // Définir la taille du viewport => 800x600
            await page.setViewport({width: 800, height: 600});

            // Aller sur la page
            await page.goto(url, {waitUntil: "networkidle2"});

            // Capture la zone du viewport => 800x600
            await page.screenshot({
                path: localFilePath,
                fullPage: false, // 800x600 seulement
            });

            await browser.close();

            // Upload to S3
            const s3Url = await this.s3service.uploadFile(localFilePath, filename);


            // delete local file
            await fs.unlink(localFilePath);

            this.logger.log(`Screenshot enregistré en local => ${localFilePath}`);
            return s3Url;
        } catch (error) {
            this.logger.error("Erreur lors de la capture du screenshot", error);
            throw error;
        }
    }
}