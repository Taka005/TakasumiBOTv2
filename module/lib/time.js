module.exports = (ms)=>{
  const t = Math.round(ms/1000);
  const h = Math.floor(t/3600);
  const m = Math.floor((t - h*3600)/60);
  const s = Math.floor(t - h*3600 - m*60);

  if(h === 0){
    if(m === 0){
      return `${s}秒`;
    }else{
      return `${m}分${s}秒`;
    }
  }else{
    return `${h}時間${m}分${s}秒`;
  }
}