# TTMS Teste Backend

API backend em Node.js com Express.js para upload e processamento de arquivos CSV.

## Funcionalidades

- Upload de arquivos CSV (1B a 10GB)
- Geração de arquivos CSV com dados da API Randommer.io
- Listagem de arquivos enviados
- Processamento de arquivos CSV com filtros

## Como executar

1. Instalar dependências:
```bash
npm install
```

2. Executar o servidor:
```bash
npm start
```

3. Para desenvolvimento (auto-reload):
```bash
npm run dev
```

## Como rodar os testes

Para rodar todos os testes unitários:
```bash
npm run test
```

Ou, se preferir, para rodar um teste específico:
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js src/test/<nome-do-teste>
```

## Rotas da API

- `POST /upload-csv`  
  Upload de arquivo CSV.  
  **Body:** `form-data` com chave `file` (tipo: File).

- `GET /generate-csv`  
  Gera um arquivo CSV com cartões Visa da Randommer.io e faz download.

- `GET /list-files`  
  Lista todos os arquivos CSV enviados.

- `GET /process-csv?fileName=arquivo.csv&filter=texto`  
  Processa um arquivo CSV, filtrando linhas que contenham o texto informado.  
  Retorna um arquivo CSV filtrado com estatísticas.

### Exemplo de uso do filtro

Para processar um arquivo CSV e filtrar linhas que contenham determinado texto, utilize:

```
GET /process-csv?fileName=nome-do-arquivo.csv&filter=texto-a-filtrar
```

O filtro é aplicado em todas as colunas. O retorno inclui as linhas filtradas e estatísticas do arquivo.

## Tecnologias

- Node.js
- Express.js
- Multer
- Axios
- @json2csv/node
- UUID
- Jest (para testes)
- Supertest (para testes de API)

## Docker

Se for usar Docker, garanta que o `.dockerignore` exclui `node_modules`, `uploads` e logs.

