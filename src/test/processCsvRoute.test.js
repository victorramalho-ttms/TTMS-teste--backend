import request from 'supertest';
import app from '../../app.js';
import fs from 'fs';
import path from 'path';

describe('GET /process-csv', () => {
    const testFile = path.resolve('uploads', 'proc.csv');
    beforeAll(() => {
        fs.writeFileSync(testFile, 'nome,idade\nDavid,\nVictor,\nJohn,\nAnna,\nVincent,\nAmanda,\nJulia,\nRobert,\nDaniel,\n');
    });
    afterAll(() => {
        fs.unlinkSync(testFile);
    });

    it('deve filtrar nomes que começam com V, J, A ou D', async () => {
        const letras = ['V', 'J', 'A', 'D'];
        const res = await request(app)
            .get('/process-csv')
            .query({ fileName: 'proc.csv', filter: 'VJAD' });
        expect(res.status).toBe(200);
        // Só deve conter nomes que começam com V, J, A ou D
        const linhas = res.text.split('\n').filter(l => l && !l.startsWith('nome') && !l.startsWith('---') && !l.startsWith('total'));
        for (const linha of linhas) {
            const primeiraLetra = linha[0];
            expect(letras).toContain(primeiraLetra);
        }
        // Não deve conter nomes que começam com outras letras
        expect(res.text).not.toMatch(/R\w+,/g); // não deve ter nomes com R
        expect(res.text).toContain('total de linhas filtradas: 7');
    });

    it('deve retornar erro se faltar parametros', async () => {
        const res = await request(app)
            .get('/process-csv')
            .query({ fileName: 'proc.csv' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'informe fileName e filter');
    });
});
