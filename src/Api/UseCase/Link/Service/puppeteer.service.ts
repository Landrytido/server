import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class PuppeteerService {
  private readonly logger = new Logger(PuppeteerService.name);

  public async captureScreenshot(url: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const filename = `screenshot_${timestamp}.png`;
      const localFilePath = path.join(process.cwd(), 'screenshots', filename);

      // Crée le dossier "screenshots" s'il n'existe pas
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Définir la taille du viewport => 800x600
      await page.setViewport({ width: 800, height: 600 });

      // Aller sur la page
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Essayer de cliquer sur un hypothétique bouton "Accepter cookies"
      // Adaptez le sélecteur à votre cas
      try {
        await page.waitForSelector('button#accept-cookies', { timeout: 3000 });
        await page.click('button#accept-cookies');
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        this.logger.warn('Bannière cookies non trouvée ou déjà fermée');
      }

      // Alternative : Masquer la bannière via CSS
      // try {
      //   await page.evaluate(() => {
      //     const cookieBanner = document.querySelector('.cookie-banner-class');
      //     if (cookieBanner) {
      //       (cookieBanner as HTMLElement).style.display = 'none';
      //     }
      //   });
      // } catch (err) {
      //   this.logger.warn('Impossible de masquer la bannière');
      // }

      // Capture la zone du viewport => 800x600
      await page.screenshot({
        path: localFilePath,
        fullPage: false, // 800x600 seulement
      });

      await browser.close();

      this.logger.log(`Screenshot enregistré en local => ${localFilePath}`);
      return localFilePath;
    } catch (error) {
      this.logger.error('Erreur lors de la capture du screenshot', error);
      throw error;
    }
  }
}
