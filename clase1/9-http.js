const http = require("node:http");
const { findAvailablePort } = require('./10-freeport');

const server = http.createServer((req, res) => {
  console.log('request received')
  res.end("hola mundo")
})


findAvailablePort(3000).then(port => {
  server.listen(port, () => {
    console.log('listening on: ', port)
  })
})