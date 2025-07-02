# TTMS Teste Backend

API backend em Node.js com Express.js para upload e processamento de arquivos CSV.

## Funcionalidades

- Upload de arquivos CSV (1b a 10GB)
- Geração de arquivos CSV com dados da API Randommer.io
- Listagem de arquivos enviados
- Processamento de arquivos com filtros

## Como executar

1. Instalar dependências:
```bash
npm install
```

2. Executar o servidor:
```bash
npm start
```

3. Para desenvolvimento:
```bash
npm run dev
```

## Rotas da API

- `POST /upload-csv` - Upload de arquivo CSV
- `GET /generate-csv` - Gerar arquivo CSV com cartões Visa
- `GET /list-files` - Listar arquivos enviados
- `GET /process-csv?fileName=arquivo.csv&filter=texto` - Processar arquivo com filtro

## Tecnologias

- Node.js
- Express.js
- Multer
- Axios
- JSON2CSV
- UUID
