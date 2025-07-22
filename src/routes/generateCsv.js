import express from 'express';
import { CardDomain } from '../domain/domain.js';


const router = express.Router();
const cardDomain = new CardDomain();

router.get('/generate-csv', async (request, response) => {
    try {
        const { fileName, filePath } = await cardDomain.generateAndSaveCsvFile(100)
        response.status(200).download(filePath, fileName);
    } catch (error) {
        response.status(500).json({ erro: 'falha ao gerar arquivo csv' });
    }
});

export default router;