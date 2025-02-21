import { Injectable, Logger } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import { promises as fs } from "fs";
import * as path from "path";

@Injectable()
export class PuppeteerService {
  private readonly logger = new Logger(PuppeteerService.name);

  public async captureScreenshot(url: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const filename = `screenshot_${timestamp}.png`;
      const localFilePath = path.join(process.cwd(), "screenshots", filename);

      // Crée le dossier "screenshots" s'il n'existe pas
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });

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
      await page.setViewport({ width: 800, height: 600 });

      // Aller sur la page
      await page.goto(url, { waitUntil: "networkidle2" });

      // Capture la zone du viewport => 800x600
      await page.screenshot({
        path: localFilePath,
        fullPage: false, // 800x600 seulement
      });

      await browser.close();

      this.logger.log(`Screenshot enregistré en local => ${localFilePath}`);
      return localFilePath;
    } catch (error) {
      this.logger.error("Erreur lors de la capture du screenshot", error);
      throw error;
    }
  }
}
