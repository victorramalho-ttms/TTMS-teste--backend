import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CsvDomain } from '../domain/csvDomain.js';

const router = express.Router();

router.get('/process-csv', async (request, response) => {
    const { fileName, filter } = request.query;
    if (!fileName || !filter) {
        return response.status(400).json({ error: 'informe fileName e filter' });
    }
    if (!fileName.startsWith('upload-')) {
        return response.status(400).json({ error: 'arquivo inválido para processamento' });
    }
    const filePath = path.resolve('uploads', fileName);
    try {
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const linhas = fileContent.split('\n').filter(l => l.trim() !== '');
        const csvDomain = new CsvDomain();
        const result = csvDomain.generateFilteredCsvWithStats(linhas, filter);
        const filteredFileName = `Filter-${fileName}`;
        await fs.writeFile(path.resolve('uploads', filteredFileName), result);
        response.setHeader('Content-Disposition', `attachment; filename="${filteredFileName}"`);
        response.setHeader('Content-Type', 'text/csv');
        response.send(result);
    } catch (error) {
        console.error('erro ao processar csv:', error.message);
        response.status(500).json({ error: 'falha ao processar arquivo csv' });
    }
});

export default router;