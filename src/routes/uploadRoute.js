import express from 'express';
import multer from 'multer';
import path from 'path';

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

    console.log('upload realizado com sucesso');
    response.json({
        message: 'upload realizado com sucesso',
        fileName: request.file.originalname,
        fileSize: request.file.size
    });
});

export default router;
