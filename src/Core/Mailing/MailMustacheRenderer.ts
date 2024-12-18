import { Injectable } from "@nestjs/common";
import * as Mustache from "mustache";
import { join } from "path";
import { promises as fs } from "fs";

@Injectable()
export default class MailMustacheRenderer {
  async render(fileName: string, data: Record<string, any>): Promise<string> {
    const templatePath = join(
      __dirname,

      "..",
      "..",
      "..",
      "src",
      "templates",
      "mails",
      fileName
    );
    console.log("template:", templatePath);

    try {
      const template = await fs.readFile(templatePath, "utf-8");
      return Mustache.render(template, data);
    } catch (error) {
      console.error("Error reading template file:", error);
      throw new Error("Failed to read template file");
    }
  }
}
