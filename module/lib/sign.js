module.exports = (n)=>{
  if(n < 0){
    return n;
  }else if(n > 0){
    return `+${n}`;
  }else{
    return "±0";
  }
}