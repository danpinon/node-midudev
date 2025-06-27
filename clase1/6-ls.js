const fss = require('node:fs');
const fs = require('node:fs/promises');

const folder = process.argv[2] ?? '.'

fss.readdir(folder, (err, files) => {
  if (err) {
    console.error(err)
    return;
  }

  files.forEach(file => {
    console.log(file)
  })
})

fs.readFile(folder)
  .then(files => {
    files.forEach(file => {
      console.log(file)
    })
  })
  .catch(err => 
    console.error(err)
  )