import request from 'supertest';
import app from '../../app.js';
import fs from 'node:fs/promises';
import path from 'node:path';

describe('GET /list-files', () => {
    const testFile = path.resolve('csvTest.csv');
    const uploadFile = path.resolve('uploads', 'upload-csvTest.csv');

    beforeAll(async () => {
        await request(app)
            .post('/upload-csv')
            .attach('file', testFile, 'csvTest.csv');
    });

    it('deve listar o arquivo gerado pelo upload', async () => {
        const exists = await fs.access(uploadFile).then(() => true).catch(() => false);
        expect(exists).toBe(true);

        const res = await request(app).get('/list-files');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(f => f.fileName === 'upload-csvTest.csv')).toBe(true);
    });
});