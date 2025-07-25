import request from 'supertest';
import app from '../app.js';

describe('GET /generate-csv', () => {
    it('deve gerar e baixar um arquivo csv com 100 linhas de dados e header', async () => {
        const res = await request(app).get('/generate-csv');
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('text/csv');
        expect(res.header['content-disposition']).toMatch(/attachment; filename=.*\.csv/);
        expect(res.text).toContain('numeroCartao');
        expect(res.text).toContain('tipo');
        expect(res.text).toContain('criadoEm');

        const linhas = res.text.split('\n').filter(l => l.trim() !== '');
        expect(linhas[0]).toContain('numeroCartao');
        expect(linhas.length).toBe(101);
    }, 300000);
});