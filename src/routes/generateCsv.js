import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { CardService } from '../services/cardServiceClass.js';
import { Parser } from 'json2csv';

const router = express.Router();
const cardService = new CardService();

router.get('/generate-csv', async (request, response) => {
    try {
        const cardsList = await cardService.generateVisaCards(100);
        const parser = new Parser({ fields: ['cardNumber'] });
        const csvContent = parser.parse(cardsList);
        const fileName = `cards-${uuid()}.csv`;
        const filePath = path.resolve('uploads', fileName);
        fs.writeFileSync(filePath, csvContent);
        console.log('csv gerado com sucesso');
        response.download(filePath, fileName);
    } catch (error) {
        console.error('erro ao gerar csv:', error.message);
        response.status(500).json({ error: 'falha ao gerar arquivo csv' });
    }
});

export default router;
