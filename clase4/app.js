import express, { json } from 'express';
import { moviesRouter } from './router/movies.js'
import { corsMiddleware } from './middlewares/cors.js';
// import ESModules
// import fs from 'node:fs';
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

// import ESModules recomendado
// import { readJson } from './utils.js';
// const movies = readJson('./movies.json');

const app = express();

app.disable('x-powered-by');

app.use(json());
app.use(corsMiddleware());

app.get('/', (req, res) => {
  res.status(200)
    .json({message: 'Hola Mundo'});
});

app.use('/movies', moviesRouter);

// middleware to handle unhandled routes
app.use((req, res) => {
  res.status(404).send('<h1>404 not found</h1>')
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log('server running on: ', `http://localhost:${PORT}`);
})