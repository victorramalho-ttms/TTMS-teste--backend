import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const router = express.Router();
const uploadsFolder = path.resolve('uploads');

router.get('/list-files', async (request, response) => {
    try {
        const fileNames = await fs.readdir(uploadsFolder, { encoding: 'utf8' });
        const csvFiles = fileNames.filter(name => name.endsWith('.csv'));

        const filesList = await Promise.all(
            csvFiles.map(async fileName => {
                const filePath = path.join(uploadsFolder, fileName);
                const stats = await fs.stat(filePath);
                return {
                    fileName,
                    fileSize: stats.size,
                    updatedAt: stats.mtime
                };
            })
        );

        filesList.sort((a, b) => b.updatedAt - a.updatedAt);

        response.json(filesList);
    } catch (error) {
        response.status(500).json({ error: 'falha ao listar arquivos' });
    }
});

export default router;