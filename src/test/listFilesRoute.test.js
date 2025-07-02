import request from 'supertest';
import app from '../../app.js';
import fs from 'fs';
import path from 'path';

describe('GET /list-files', () => {
    beforeAll(() => {
        fs.writeFileSync(path.resolve('uploads', 'testes.csv'), 'a,b,c\n1,2,3');
    });
    afterAll(() => {
        fs.unlinkSync(path.resolve('uploads', 'teste.csv'));
    });

    it('deve listar arquivos enviados', async () => {
        const res = await request(app)
            .get('/list-files');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(f => f.fileName === 'teste.csv')).toBe(true);
    });
});
