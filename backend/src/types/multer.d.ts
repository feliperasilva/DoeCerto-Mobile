import * as express from 'express'; 
import { Multer } from 'multer';

declare global {
  namespace Express {

    interface File extends Multer.File {}
  }
}