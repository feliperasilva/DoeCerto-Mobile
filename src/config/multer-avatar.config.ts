import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerAvatarConfig = {
  storage: diskStorage({
    destination: './uploads/profiles', // ✅ Pasta correta
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `avatar-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      return callback(
        new BadRequestException('Apenas arquivos de imagem (jpg, jpeg, png, webp) são permitidos!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};