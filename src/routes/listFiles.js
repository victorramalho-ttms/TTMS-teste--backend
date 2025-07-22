import express from 'express';
import path from 'node:path';
import { FileDomain } from '../domain/domain.js';

const router = express.Router();
const uploadsFolder = path.resolve('uploads');
const fileDomain = new FileDomain();

router.get('/list-files', async (request, response) => {
    try {
        const filesList = await fileDomain.listCsvFiles(uploadsFolder);
        response.status(200).json(filesList);
    } catch (error) {
        response.status(500).json({ error: 'falha ao listar arquivos' });
    }
});

export default router;