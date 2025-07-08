export class CsvDomain {
    generateFilteredCsvWithStats(lines, filterText) {
        const header = lines[0];
        const dados = lines.slice(1);

        let resultado = [header];
        let filtradas = 0;

        for (const linha of dados) {
            const campos = linha.split(',');
            const nome = campos[1]?.replace(/"/g, '').trim();
            if (nome && nome.startsWith(filterText)) {
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