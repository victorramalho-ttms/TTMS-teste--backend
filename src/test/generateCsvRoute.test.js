import request from 'supertest';
import app from '../../app.js';

describe('GET /generate-csv', () => {
    it('deve gerar e baixar um arquivo csv', async () => {
        const res = await request(app)
            .get('/generate-csv');
        expect(res.status).toBe(200);
        expect(res.header['content-disposition']).toMatch(/attachment; filename=.*\.csv/);
        expect(res.header['content-type']).toBe('text/csv; charset=utf-8');
        expect(res.text).toContain('cardNumber');
    });
});
