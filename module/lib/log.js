module.exports = {
  "info":(str)=>{
    console.log(`\x1b[32m[INFO] ${str}\x1b[39m`);
  },
  "warn":(str)=>{
    console.warn(`\x1b[33m[WARN] ${str}\x1b[39m`);
  },
  "error":(str)=>{
    console.error(`\x1b[31m[ERROR] ${str}\x1b[39m`);
  },
  "debug":(str)=>{
    console.debug(`\x1b[34m[ERROR] ${str}\x1b[39m`)
  }
}