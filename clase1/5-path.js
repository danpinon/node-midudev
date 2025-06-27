const path = require('node:path');

// barra separadora segun OS
console.log('sep: ', path.sep)

// unir rutas con path join
const filePath = path.join('content', 'subfolder', 'test.txt')
console.log({ filePath });

const base = path.basename('content/subfolder/test.txt')
console.log({ base })

const ext = path.extname('test.txt')
console.log({ ext })