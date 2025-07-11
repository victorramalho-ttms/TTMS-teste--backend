import { Parser } from 'json2csv';
import fs from 'node:fs/promises';
import path from 'node:path';

export class CardDomain {
    async mountVisaCardsList(apiCallFunction, quantity = 100) {
        const cardsList = [];
        for (let i = 0; i < quantity; i++) {
            try {
                const response = await apiCallFunction();
                cardsList.push({ cardNumber: response.data });
            } catch (error) {
                throw new Error('api falhou, nao foi possivel obter numero do cartao', error);
            }
        }
        return cardsList;
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

    generateCsvContentFromCards(cardsList) {
        const cardsWithColumns = this.mapCardsToColumns(cardsList);
        const parser = new Parser({ fields: ['numeroCartao', 'nome', 'validade', 'tipo', 'cvv', 'pin', 'criadoEm'] });
        const csvContent = parser.parse(cardsWithColumns);
        return { csvContent, cardsWithColumns };
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

        filesList.sort((a, b) => b.updatedAt - a.updatedAt);
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