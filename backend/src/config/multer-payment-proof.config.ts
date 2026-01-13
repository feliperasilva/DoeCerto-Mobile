import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const multerPaymentProofConfig = {
  storage: diskStorage({
    destination: './uploads/payment-proofs',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `proof-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Aceitar apenas imagens e PDFs
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return callback(
        new BadRequestException('Apenas imagens (jpg, jpeg, png) e PDF são permitidos!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};