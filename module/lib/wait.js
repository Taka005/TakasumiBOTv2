module.exports = class Wait{
  constructor(rate){
    this.time = {};
    this.rate;
  }

  count(id){
    if(this.time[id]){
      return true;
    }else{
      this.time[id] = true;
      
      setTimeout(()=>{
        this.time[id] = false;
      },this.rate);
      
      return false;
    }
  }
}