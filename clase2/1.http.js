const http = require("node:http");
const fs = require("node:fs");

const PORT = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  console.log('request received ', req.url);
  if (req.url === '/') {
    res.statusCode = 200; //ok
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('Bienvenido a mi página de inicio');
  } else if (req.url === '/image.png') {
    fs.readFile('./image.png', (err, image) => {
      if (err) {
        res.statusCode = 500;
        res.end("<h1>Internal Server Error</h1>");
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/png');
        res.end(image)
      }
    });
  } else if (req.url === '/contact') {
    res.statusCode = 200; //ok
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('contacto');
  } else {
    res.statusCode = 404; // Not found
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('<h1>not found</h1>')
  }
})


server.listen(PORT, () => {
  console.log('listening on: ', PORT)
})