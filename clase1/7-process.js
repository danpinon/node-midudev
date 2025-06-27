// process

console.log(process.argv);

// current working directory
const cwd = process.cwd();
console.log({ cwd })

process.on('exit', () => {
  console.log('exiting...')
})

// PEPITO=hola node 7-process.js 
console.log(process.env.PEPITO)
// exit process control
process.exit(1);