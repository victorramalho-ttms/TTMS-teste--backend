import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '../../app.js';

describe('POST /upload-csv', () => {
    it('deve fazer upload de um arquivo csv com sucesso', async () => {
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', Buffer.from('a,b,c\n1,2,3'), 'teste.csv');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'upload realizado com sucesso');
        expect(res.body).toHaveProperty('fileName', 'teste.csv');
    });

    it('deve recusar upload de arquivo que nao seja csv', async () => {
        const res = await request(app)
            .post('/upload-csv')
            .attach('file', Buffer.from('conteudo'), 'teste.txt');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'apenas arquivos csv sao permitidos');
    });

    it('deve retornar erro se nenhum arquivo for enviado', async () => {
        const res = await request(app)
            .post('/upload-csv');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'nenhum arquivo enviado');
    });
});
