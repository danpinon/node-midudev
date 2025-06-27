const express = require('express');
const dittoJson = require('./dittojson');

const app = express();

app.disable('x-powered-by');

const PORT = process.env.PORT ?? 1234;

// same thing as app.use(express.json());
/*
app.use((req, res, next) => {
  if (req.method !== 'POST') return next();
  if (req.headers['content-type'] !== 'application/json') return next();
  let body = ''
  // listens event data to receive flowing data
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  // listens event when finished
  req.on('end', () => {
    const data = JSON.parse(body);
    data.timeStamp = Date.now();
    // mutate request and assign body
    req.body = data;
    next();
  })
});
*/

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200)
    .json({message: 'Hola Mundo'});
});

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJson);
});

app.post('/pokemon', (req, res) => {
  // with req.body we could save on the db
  res.status(201).json(req.body);
});

// middleware to handle unhandled routes
app.use((req, res) => {
  res.status(404).send('<h1>404 not found</h1>')
})

app.listen(PORT, () => {
  console.log('running server on: ', `http://localhost:${PORT}`)
})