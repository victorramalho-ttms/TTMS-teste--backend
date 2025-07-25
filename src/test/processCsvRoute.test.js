import request from 'supertest';
import app from '../app.js';
import path from 'node:path';

describe('GET /process-csv', () => {
    const testFile = path.resolve('src', 'test', 'files', 'csvTest.csv');
    let uploadedFileName = 'upload-csvTest.csv';

    beforeAll(async () => {
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', testFile, 'csvTest.csv');
        if (res.body && res.body.fileName) {
            uploadedFileName = res.body.fileName;
        }
    });

    it('deve filtrar linhas cujo nome começa com "T"', async () => {
        const res = await request(app)
            .get('/process-csv')
            .query({ fileName: uploadedFileName, filter: 'T' });
        expect(res.status).toBe(200);

        const linhas = res.text.split('\n').filter(l => l && !l.startsWith('---') && !l.startsWith('total') && !l.startsWith('filtro'));

        for (const linha of linhas.slice(1)) {
            expect(linha.includes('T')).toBe(true);
        }

        const estatisticas = res.text.split('\n').find(l => l.startsWith('total de linhas filtradas:'));
        const totalFiltradas = parseInt(estatisticas.split(':')[1].trim(), 10);
        expect(totalFiltradas).toBe(linhas.length - 1);
        expect(linhas[0]).toContain('numeroCartao');
    });
});