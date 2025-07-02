import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const uploadsFolder = path.resolve('uploads');

router.get('/list-files', (request, response) => {
    try {
        const fileNames = fs.readdirSync(uploadsFolder);

        const filesList = fileNames.map(fileName => {
            const filePath = path.join(uploadsFolder, fileName);
            const stats = fs.statSync(filePath);
            return {
                fileName,
                fileSize: stats.size,
                createdAt: stats.birthtime
            };
        });

        console.log('arquivos listados com sucesso');
        response.json(filesList);
    } catch (error) {
        console.error('erro ao listar arquivos:', error);
        response.status(500).json({ error: 'falha ao listar arquivos' });
    }
});

export default router;
