import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { CardService } from '../services/cardServiceClass.js';
import { CardDomain } from '../domain/domain.js';


const router = express.Router();
const cardService = new CardService();
const cardDomain = new CardDomain();

router.get('/generate-csv', async (request, response) => {
    try {
        const cardsList = await cardService.generateVisaCards(100);

        const { csvContent } = cardDomain.generateCsvContentFromCards(cardsList);

        const fileName = `cartoes-${uuid()}.csv`;
        const filePath = path.resolve('uploads', fileName);
        await fs.writeFile(filePath, csvContent);
        console.log('csv gerado com sucesso');
        response.setHeader('X-nome-arquivo', fileName);
        response.download(filePath, fileName);
    } catch (error) {
        console.error('erro ao gerar csv:', error.message);
        response.status(500).json({ erro: 'falha ao gerar arquivo csv' });
    }
});

export default router;