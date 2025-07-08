import request from 'supertest';
import app from '../../app.js';

describe('GET /generate-csv', () => {
    it('deve gerar e baixar um arquivo csv', async () => {
        const res = await request(app).get('/generate-csv');
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('text/csv');
        expect(res.header['content-disposition']).toMatch(/attachment; filename=.*\.csv/);
        expect(res.text).toContain('numeroCartao');
        expect(res.text).toContain('tipo');
        expect(res.text).toContain('criadoEm');
    }, 300000);
});