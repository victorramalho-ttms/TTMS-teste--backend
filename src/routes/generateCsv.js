import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { CardService } from '../services/cardServiceClass.js';
import { Parser } from 'json2csv';

const router = express.Router();
const cardService = new CardService();

router.get('/generate-csv', async (request, response) => {
    try {
        const cardsList = await cardService.generateVisaCards(100);

        const cardsWithColumns = cardsList.map(card => {
            const cardObj = typeof card.cardNumber === 'string'
                ? JSON.parse(card.cardNumber)
                : card.cardNumber;

            return {
                numeroCartao: cardObj.cardNumber,
                nome: cardObj.fullName,
                validade: cardObj.date,
                tipo: cardObj.type,
                cvv: cardObj.cvv,
                pin: cardObj.pin,
                criadoEm: new Date().toISOString()
            };
        });

        const parser = new Parser({ fields: ['numeroCartao', 'nome', 'validade', 'tipo', 'cvv', 'pin', 'criadoEm'] });
        const csvContent = parser.parse(cardsWithColumns);

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
