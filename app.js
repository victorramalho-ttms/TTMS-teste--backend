import express from 'express';
import uploadRoute from './src/routes/uploadRoute.js';
import generateCsvRoute from './src/routes/generateCsv.js';
import listFilesRoute from './src/routes/listFiles.js';
import processCsvRoute from './src/routes/processCsv.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(uploadRoute);
app.use(generateCsvRoute);
app.use(listFilesRoute);
app.use(processCsvRoute);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`server rodando na porta ${port}`);
    });
}

export default app;