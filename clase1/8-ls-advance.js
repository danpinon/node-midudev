const { stat } = require('node:fs');
const fs = require('node:fs/promises');
const path = require('node:path');
const pc = require('picocolors');

const folder = process.argv[2] ?? '.'

async function ls(folder) {
  let files;
  try {
    files = await fs.readdir(folder);
  } catch {
    console.error(pc.red(`no se pudo leer el directorio ${folder}`));
    process.exit(1)
  }
  const filePromises = files.map(async file => {
    const filePath = path.join(folder, file);
    let stats;
    try {
      stats = await fs.stat(filePath);
    } catch {
      console.error(ps.red('no se pudo obtener stats'));
      process.exit(1);
    }
    const isDirectory = stats.isDirectory();
    const fileType = isDirectory ? 'd' : '-';
    const fileSize = stats.size;
    const fileModified = stats.mtime.toLocaleString();
    return `${pc.bgMagenta(fileType)} ${pc.blue(file.padEnd(20))} ${pc.green(fileSize.toString().padStart(10))} ${pc.yellow(fileModified) }`
  })

  const filesInfo = await Promise.all(filePromises);
  filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder)
