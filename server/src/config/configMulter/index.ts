import multer from 'multer';
import path from 'node:path';

export default class ConfigMulter {
  upload() {
    const configUpload = multer({
      storage: multer.diskStorage({
        destination(request, file, callback) {
          callback(null, path.resolve(__dirname, '../../../', 'uploads'));
        },
        filename(request, file, callback) {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    });

    return configUpload;
  }
}
