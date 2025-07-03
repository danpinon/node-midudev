import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';

const PORT = process.env.PORT ?? 3000;

const app = express();

dotenv.config();

export const db = createClient({
    url: "libsql://safe-supernaut-danpinon.aws-us-east-1.turso.io",
    syncUrl: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    username TEXT
  );
`)

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: { 
    maxDisconnectionDuration: 60,
  },
});

io.on('connection', async socket => {
  console.log('a user has connected');
  socket.on('chat message', async (message) => {
    let result;
    const username = socket.handshake.auth.username ?? 'anonymous';
    try {
      result = await db.execute({
        sql: `INSERT INTO messages (content, username) VALUES (:message, :username)`,
        args: { message, username }
      })
    } catch (e) {
      throw new Error('Message failed to be written in the db');
    }
    io.emit('chat message', message, result.lastInsertRowid.toString(), username);
  });

  socket.on('disconnect', () => {
    console.log('a user has disconnected');
  });

    if (!socket.recovered) {
      try {
        const result = await db.execute({
          sql: 'SELECT * FROM messages WHERE id > ?',
          args: [socket.handshake.auth.serverOffset ?? 0],
        });
        result.rows.forEach(row => {
          socket.emit('chat message', row.content, row.id.toString(), row.username)
        });
      } catch (e) {
        throw new Error('Cannot get messages from db');
      }
    }
});


app.use(logger("dev"));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
})

server.listen(PORT, () => {
  console.log('running on: ', `http://localhost:${PORT}`)
})