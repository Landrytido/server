import { FileUpload } from 'graphql-upload';

export default class UploadFileDto {
  file: FileUpload;
  path: string;
}
