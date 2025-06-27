const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const z = require('zod');
const cors = require('cors');

const { validateMovie, validatePartialMovie } = require('./schemas/movies');

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'http://localhost:5000',
      'https://movies.com',
      'https://midu.dev'
    ];
    if (ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true);
    }
    if (!origin) {
      callback(null, true);
    }

    return callback(new Error('Not allowed CORS'));
  }
}));

app.get('/', (req, res) => {
  res.status(200)
    .json({message: 'Hola Mundo'});
});


app.get('/movies', (req, res) => {
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('access-control-allow-origin', origin)
  // }
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(422).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID, //uuid v4
    ...result.data
  }
  movies.push(newMovie);
  res.status(201)
    .json(newMovie); // good for updating the client cache
})

app.get('/movies/:id', (req, res) => {// path with dynamic id
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id);
  if (!movie) {
    return res.status(404)
      .json({ message: 'Movie not found'});
  }
  res.json(movie);
});

app.patch('/movies/:id', (req, res) => {// path with dynamic id
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
});

app.delete('/movies/:id', (req, res) => {// path with dynamic id
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('access-control-allow-origin', origin)
  // }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1);

  return res.json({message: 'Movie deleted'})
});

app.options('/movies/:id', (req, res) => {
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  // }
  res.send();
})

// middleware to handle unhandled routes
app.use((req, res) => {
  res.status(404).send('<h1>404 not found</h1>')
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log('server running on: ', `http://localhost:${PORT}`);
})