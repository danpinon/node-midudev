import cors from 'cors';

export const corsMiddleware = () => cors({
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
})