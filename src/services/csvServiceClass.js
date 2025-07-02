import fs from 'fs';
import readline from 'readline';

export class CsvService {
    async generateFilteredCsvWithStats(filePath, filterText) {
        const filteredLines = [];
        let totalLines = 0;

        const stream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: stream });

        for await (const line of rl) {
            if (line.trim() !== '') {
                totalLines++;
                if (line.includes(filterText)) {
                    filteredLines.push(line);
                }
            }
        }

        const csvContent = filteredLines.join('\n') + '\n\n' +
            '--- estatísticas ---\n' +
            `total de linhas no arquivo: ${totalLines}\n` +
            `total de linhas filtradas: ${filteredLines.length}\n` +
            `filtro aplicado: "${filterText}"`;

        return csvContent;
    }
}
