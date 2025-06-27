// promisify
const { promisify } = require('node:util');
const fss = require('node:fs');
const readFilePromise = promisify(fss.readFile);
readFilePromise('./archivo.txt', 'utf-8')
  .then(data => console.log(data))
  .catch(err => console.error(err))


// native promise module
const fs = require('node:fs/promises');

fs.readFile('./archivo.txt', {encoding: 'utf8'})
  .then(data => console.log(data))
  .catch(err => console.error(err));


(async () => {
  const text = await fs.readFile('./archivo.txt', 'utf-8');
  console.log({ text })
})()
