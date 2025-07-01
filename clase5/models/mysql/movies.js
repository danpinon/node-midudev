import mysql from 'mysql2/promise';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb',
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG
const connection = await mysql.createConnection(connectionString);

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const [genres] = await connection.query(
        `SELECT id, name 
        FROM moviesdb.genre 
        WHERE LOWER(moviesdb.genre.name) = ?;`, [genre.toLowerCase()]
      );
      if (genres === 0) return [];
      const [{ id }] = genres;
      const [result] = await connection.query(
        `SELECT
        BIN_TO_UUID(id) AS id,
        title,
        year,
        director,
        duration,
        poster,
        rate
        FROM moviesdb.movie
          JOIN moviesdb.movie_genres
          ON moviesdb.movie.id = moviesdb.movie_genres.movie_id
          WHERE moviesdb.movie_genres.genre_id = ?;`, [id]
      );

      return result;
    }
    const [result] = await connection.query(
      `SELECT 
        BIN_TO_UUID(id) AS id,
        title,
        year,
        director,
        duration,
        poster,
        rate FROM moviesdb.movie`
    );

    return result;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT 
        BIN_TO_UUID(id) AS id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      FROM moviesdb.movie 
      WHERE BIN_TO_UUID(id) = ?;`, [id]
    );
    if (!movies.length) return null;
    return movies[0];
  }

  static async create({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre: genresInput
    } = input;

    await connection.beginTransaction();
    
    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;
    try {

      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]);

      const [movies] = await connection.query(
        `SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate 
        FROM moviesdb.movie
        WHERE BIN_TO_UUID(moviesdb.movie.id) = ?;`, 
        [uuid]);

      await Promise.all(
        genresInput.map(async g => {
          const [rows] = await connection.query(
            `SELECT id FROM moviesdb.genre WHERE LOWER(name) = ?`,
            [g.toLowerCase()]
          );
          const genreId = rows[0]?.id;
          if (!genreId) throw new Error(`Género no encontrado: ${g}`);
          
          await connection.query(
            `INSERT INTO moviesdb.movie_genres (movie_id, genre_id)
            VALUES (UUID_TO_BIN(?), ?)`,
            [uuid, genreId]
          );
        })
      );

      await connection.commit();
      return movies[0]
    } catch(e) {
      await connection.rollback();
      throw new Error("Movie failed to be created");
    }
  }

  static async update({ id, input }) {
    try {
      const movie = await this.getById({ id })
      const updatedMovie = { 
        ...movie, 
        ...input
      };
      const {
        title,
        year,
        director,
        duration,
        poster,
        rate,
        genre
      } = updatedMovie;

      await connection.query(`
      UPDATE movie
      SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
      WHERE movie.id = ?`, [title, year, director, duration, poster, rate, id]);
      
      return updatedMovie;
    } catch(e) {
      throw new Error('Insertion failed');
    }
  }

  static async delete({ id }) {
    await connection.beginTransaction()
    try {
        // db has on delete cascade so this is not necesary
        // await connection.query(`
        // DELETE FROM moviesdb.movie_genres 
        // WHERE moviesdb.movie_genres.movie_id = UUID_TO_BIN(?)
        // `, [id]);

      const [result] = await connection.query(`
        DELETE FROM moviesdb.movies 
        WHERE moviesdb.movies.id = UUID_TO_BIN(?)
        `, [id]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch(e) {
      await connection.rollback();
      throw new Error('Movie deletion failed');
    }
  }
}
