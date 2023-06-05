module.exports = async()=>{
  const os = require("os");

  const start = getUsage();
  return new Promise((resolve)=>{
    setTimeout(()=>{
      const end = getUsage();

      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;

      resolve(100 - Math.floor((100 * idleDifference) / totalDifference));
    },100);
  });

  function getUsage(){
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
  
    cpus.forEach((cpu)=>{
      for(const type in cpu.times){
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
  
    return {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length
    };
  }
}