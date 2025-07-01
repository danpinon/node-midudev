import z from 'zod';

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
  genre: z.array(
    z.enum(['Action', 'Sci-Fi', 'Crime', 'Adventure', 'Drama', 'Romance', 'Animation', 'Biography', 'Fantasy', 'Horror', 'Thriller']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum genre'
    }
  ),
  rate: z.number().min(0).max(10).default(0),
})

export function validateMovie(input) {
  return movieSchema.safeParse(input);
}

export function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}
