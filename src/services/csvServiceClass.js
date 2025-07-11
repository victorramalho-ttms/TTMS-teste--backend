import fs from 'node:fs/promises';
import { CsvDomain } from '../domain/domain.js';

export class CsvService {
    async generateFilteredCsvWithStats(filePath, filterText) {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const linhas = fileContent.split('\n').filter(l => l.trim() !== '');
        const csvDomain = new CsvDomain();
        return csvDomain.generateFilteredCsvWithStats(linhas, filterText);
    }
}