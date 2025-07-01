import { createApp } from './app.js';
import { MovieModel } from './models/local/movies.js';

createApp({ movieModel: MovieModel });