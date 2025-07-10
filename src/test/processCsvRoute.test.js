import request from 'supertest';
import app from '../app.js';
import fs from 'node:fs/promises';
import path from 'node:path';

describe('GET /process-csv', () => {
    const testFile = path.resolve('uploads', 'upload-csvTest.csv');

    beforeAll(async () => {
        await fs.copyFile('csvTest.csv', testFile);
    });


    it('deve filtrar linhas cujo nome começa com "T"', async () => {
        const res = await request(app)
            .get('/process-csv')
            .query({ fileName: 'upload-csvTest.csv', filter: 'T' });
        expect(res.status).toBe(200);

        const linhas = res.text.split('\n').filter(l => l && !l.startsWith('---') && !l.startsWith('total') && !l.startsWith('filtro'));

        for (const linha of linhas.slice(1)) {
            const campos = linha.split(',');
            const nome = campos[1]?.replace(/"/g, '');
            if (nome) expect(nome.startsWith('T')).toBe(true);
        }
    });
});