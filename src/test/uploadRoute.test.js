import request from 'supertest';
import app from '../app.js';
import fs from 'node:fs/promises';
import path from 'node:path';

describe('Upload', () => {
    const testFile = path.resolve('src', 'test', 'files', 'csvTest.csv');
    const uploadedFile = path.resolve('uploads', 'upload-csvTest.csv');

    it('faz upload do arquivo csvTest.csv', async () => {
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', testFile, 'csvTest.csv');
        expect(res.status).toBe(200);
        expect(res.body.fileName).toBe('upload-csvTest.csv');
        expect(res.body.message).toBe('upload realizado com sucesso');
        const exists = await fs.stat(uploadedFile).then(() => true).catch(() => false);
        expect(exists).toBe(true);
    });
});