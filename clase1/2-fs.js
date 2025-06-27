const fs = require('node:fs');

const stats = fs.statSync('./archivo.txt');

console.log(
  stats.isFile(), // si es archivo
  stats.isDirectory(), // si es directorio
  stats.isSymbolicLink(), // si es enlace simbolico
  stats.size // tamano del archivo
);