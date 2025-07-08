import express from 'express';
import fs from 'fs/promises';
import path from 'node:path';

const router = express.Router();
const uploadsFolder = path.resolve('uploads');

router.get('/process-csv', async (req, res) => {
    const { fileName, filter } = req.query;

    if (!fileName || !filter) {
        return res.status(400).json({ error: 'Parâmetros fileName e filter são obrigatórios' });
    }

    const filePath = path.join(uploadsFolder, fileName);

    try {
        await fs.access(filePath);
    } catch {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');
        const linhas = content.split('\n').filter(l => l.trim() !== '');
        const header = linhas[0];
        const dados = linhas.slice(1);

        let total = dados.length;
        let filtradas = 0;
        let resultado = [header];

        for (const linha of dados) {
            const campos = linha.split(',');
            const nome = campos[1]?.replace(/"/g, '');
            if (nome && nome.startsWith(filter)) {
                resultado.push(linha);
                filtradas++;
            }
        }

        let output = resultado.join('\n') + '\n';
        output += '\n--- estatisticas ---\n';
        output += `total de linhas no arquivo: ${total}\n`;
        output += `total de linhas filtradas: ${filtradas}\n`;
        output += `filtro aplicado: "${filter}"\n`;

        res.type('text/plain').send(output);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar o arquivo' });
    }
});

export default router;