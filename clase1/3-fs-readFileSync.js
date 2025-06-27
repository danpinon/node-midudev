const fs = require('node:fs');

// read sync
const text = fs.readFileSync('./archivo.txt', 'utf-8');

console.log(
  text
)

// read async
const text2 = fs.readFile('./archivo.txt', {encoding: 'utf-8'}, (err, data) => {
  console.log({data})
})