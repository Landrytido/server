import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';

@Injectable()
export class PuppeteerService {
    async captureScreenshot(url: string): Promise<string> {
        // Lancer Puppeteer pour générer la capture d'écran
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const screenshotPath = path.join(__dirname, 'screenshot.png');

        await page.screenshot({ path: screenshotPath });
        await browser.close();

        return screenshotPath;
    }

    async uploadToCdn(screenshotPath: string, fileName: string): Promise<string> {
        // Créer un objet FormData
        const formData = new FormData();

        // Convertir le ReadStream en Buffer
        const buffer = fs.readFileSync(screenshotPath);

        // Ajouter l'image en tant que Buffer
        formData.append('file', buffer, { filename: fileName, contentType: 'image/png' });
        formData.append('path', `images/screenshots/${fileName}`);

        // Envoi de l'image au CDN via ton API
        const response = await axios.post('http://ton-cdn-url/file/upload', formData, {
            headers: {
                ...formData.getHeaders(), // Prendre en charge les headers de FormData
                'Authorization': 'Bearer ton-token', // Si tu utilises un token d'authentification
            },
        });

        // Retourner l'URL de l'image téléchargée
        return response.data.url; // Supposons que ton API renvoie l'URL du fichier
    }
}
