import express from 'express';
import path from 'node:path';
import { CsvDomain } from '../domain/domain.js';

const router = express.Router();
const csvDomain = new CsvDomain();

router.get('/process-csv', async (request, response) => {
    const { fileName, filter } = request.query;
    if (!fileName || !filter) {
        return response.status(400).json({ error: 'informe fileName e filter' });
    }
    try {
        const { fileName: filteredFileName, filePath: filteredFilePath } =
            await csvDomain.processAndSaveFilteredCsv(fileName, filter, path.resolve('uploads'));
        response.status(200).download(filteredFilePath, filteredFileName);
    } catch (error) {
        console.error('erro ao processar csv:', error.message);
        response.status(500).json({ error: 'falha ao processar arquivo csv' });
    }
});

export default router;