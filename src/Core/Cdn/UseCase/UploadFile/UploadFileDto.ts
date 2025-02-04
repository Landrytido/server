export default class UploadFileDto {
  file: Express.Multer.File;
  path: string;
  quality?: string;
  width?: string;
  height?: string;
}