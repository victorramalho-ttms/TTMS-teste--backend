import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';

const router = express.Router();

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

router.post('/upload-csv', upload.single('file'), (request, response) => {
    if (!request.file) {
        return response.status(400).json({ error: 'nenhum arquivo enviado' });
    }

    const oldPath = request.file.path;
    const newFileName = `upload-${request.file.originalname}`;
    const newPath = path.join(request.file.destination, newFileName);

    fs.renameSync(oldPath, newPath);

    response.json({
        message: 'upload realizado com sucesso',
        fileName: newFileName,
        fileSize: request.file.size
    });
});

export default router;
