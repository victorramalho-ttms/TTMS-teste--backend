import express from 'express';
import multer from 'multer';
import path from 'node:path';
import { FileDomain } from '../domain/domain.js';

const router = express.Router();
const fileDomain = new FileDomain();

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 * 1024 },
    fileFilter: (request, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return cb(new Error('apenas arquivos csv sao permitidos'));
        }
        cb(null, true);
    }
});

router.post('/upload-csv', upload.single('file'), async (request, response) => {
    try {
        const result = await fileDomain.handleCsvUpload(request.file);
        response.status(200).json(result);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

export default router;
