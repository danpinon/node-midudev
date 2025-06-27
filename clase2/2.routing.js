const http = require('node:http');
const dittoJSON = require('./dittojson.js');


const processRequest = (req, res) => {
  const { method, url } = req;

  switch(method) {
    case 'GET':
      switch(url) {
        case '/':
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end('hola mundo');
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(JSON.stringify(dittoJSON));
        default:
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end('<h1>Not Found</h1>');
      }
    case 'POST':
      switch(url) {
        case '/pokemon': {
          let body = ''

          // listens event data to receive flowing data
          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          // listens event when finished
          req.on('end', () => {
            const data = JSON.parse(body);
            // here we can call a database to save the data
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8'});
            data.timeStamp = Date.now();
            res.end(JSON.stringify(data));
          })
          break;
        }
        default:
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html: charset=utf-8");
          return res.send("<h1>404 Not found</h1>")
      }
  }
}

const server = http.createServer(processRequest);

const PORT = process.env.PORT ?? 1234
server.listen(PORT, () => {
  console.log('listening: ', `http://localhost:${PORT}`)
})