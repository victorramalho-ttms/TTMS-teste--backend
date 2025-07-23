import { AsyncParser } from '@json2csv/node';
import { v4 as uuid } from 'uuid';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CardService } from '../services/cardServiceClass.js';

export class CardDomain {
    mountVisaCardsList(cardsList) {
        return cardsList.map(card => ({
            numeroCartao: card.cardNumber || card.number || '',
            nome: card.fullName || card.name || '',
            validade: card.date || card.validade || '',
            tipo: card.type || 'Visa',
            cvv: card.cvv || '',
            pin: card.pin || '',
            criadoEm: new Date().toISOString()
        }));
    }

    mapCardsToColumns(cardsList) {
        return cardsList.map(card => {
            const cardObj = typeof card.cardNumber === 'string'
                ? JSON.parse(card.cardNumber)
                : card.cardNumber;

            return {
                numeroCartao: cardObj.cardNumber,
                nome: cardObj.fullName,
                validade: cardObj.date,
                tipo: cardObj.type,
                cvv: cardObj.cvv,
                pin: cardObj.pin,
                criadoEm: new Date().toISOString()
            };
        });
    }

    async generateCsvContentFromCards(cardsList) {
        const cardsWithColumns = this.mapCardsToColumns(cardsList);
        const fields = ['numeroCartao', 'nome', 'validade', 'tipo', 'cvv', 'pin', 'criadoEm'];
        const opts = { fields };
        const parser = new AsyncParser(opts);
        return parser.parse(cardsWithColumns).promise().then(csvContent => ({
            csvContent,
            cardsWithColumns
        }));
    }

    async generateAndSaveCsvFile(quantity = 100) {
        const cardService = new CardService();
        const cardsRaw = await cardService.fetchVisaCards(quantity);
        const cardsList = this.mountVisaCardsList(cardsRaw);
        const { csvContent } = await this.generateCsvContentFromCards(cardsList);

        const fileName = `cartoes-${uuid()}.csv`;
        const filePath = path.resolve('uploads', fileName);
        await fs.writeFile(filePath, csvContent);

        return { fileName, filePath };
    }
}

export class CsvDomain {
    async processCsvFile(fileName, filter, uploadsFolder = 'uploads') {
        const filePath = path.resolve(uploadsFolder, fileName);
        await fs.access(filePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const linhas = fileContent.split('\n').filter(l => l.trim() !== '');
        const result = this.generateFilteredCsvWithStats(linhas, filter);
        const filteredFileName = `Filter-${fileName}`;
        const outputPath = path.resolve(uploadsFolder, filteredFileName);
        await fs.writeFile(outputPath, result);
        return { result, filteredFileName };
    }

    async processAndSaveFilteredCsv(fileName, filter, uploadsFolder = 'uploads') {
        const { filteredFileName } = await this.processCsvFile(fileName, filter, uploadsFolder);
        const filteredFilePath = path.resolve(uploadsFolder, filteredFileName);
        return { fileName: filteredFileName, filePath: filteredFilePath };
    }

    generateFilteredCsvWithStats(lines, filterText) {
        const header = lines[0];
        const dados = lines.slice(1);

        let resultado = [header];
        let filtradas = 0;

        for (const linha of dados) {
            if (linha.includes(filterText)) {
                resultado.push(linha);
                filtradas++;
            }
        }

        let output = resultado.join('\n') + '\n';
        output += '\n--- estatisticas ---\n';
        output += `total de linhas no arquivo: ${dados.length}\n`;
        output += `total de linhas filtradas: ${filtradas}\n`;
        output += `filtro aplicado: "${filterText}"\n`;

        return output;
    }
}

export class FileDomain {
    async listCsvFiles(uploadsFolder) {
        const fileNames = await fs.readdir(uploadsFolder, { encoding: 'utf8' });
        const csvFiles = fileNames.filter(name => name.endsWith('.csv'));

        const filesList = await Promise.all(
            csvFiles.map(async fileName => {
                const filePath = path.join(uploadsFolder, fileName);
                const stats = await fs.stat(filePath);
                return {
                    fileName,
                    fileSize: stats.size,
                    updatedAt: stats.mtime
                };
            })
        );

        filesList.sort((firstFile, secondFile) => secondFile.updatedAt - firstFile.updatedAt);
        return filesList;
    }

    async handleCsvUpload(requestFile) {
        if (!requestFile) {
            throw new Error('nenhum arquivo enviado');
        }
        const oldPath = requestFile.path;
        const newFileName = `upload-${requestFile.originalname}`;
        const newPath = path.join(requestFile.destination, newFileName);

        await fs.rename(oldPath, newPath);

        return {
            message: 'upload realizado com sucesso',
            fileName: newFileName,
            fileSize: requestFile.size
        };
    }
}