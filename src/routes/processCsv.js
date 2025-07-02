import express from 'express';
import path from 'path';
import { CsvService } from '../services/csvServiceClass.js';

const router = express.Router();
const csvService = new CsvService();

router.get('/process-csv', async (request, response) => {
    const { fileName, filter } = request.query;
    if (!fileName || !filter) {
        return res.status(400).json({ error: 'informe fileName e filter' });
    }
    const filePath = path.resolve('uploads', fileName);
    try {
        const result = await csvService.generateFilteredCsvWithStats(filePath, filter);
        response.setHeader('Content-Disposition', `attachment; filename="${fileName.replace('.csv', '')}-filtered.csv"`);
        response.setHeader('Content-Type', 'text/csv');
        console.log('csv processado com sucesso');
        response.send(result);
    } catch (error) {
        console.error('erro ao processar csv:', error.message);
        response.status(500).json({ error: 'falha ao processar arquivo csv' });
    }
});

export default router;
