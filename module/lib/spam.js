module.exports = class Spam{
  constructor(rate,isWait){
    this.time = {};
    this.rate = rate;
    this.isWait = isWait;
  }

  count(id){
    if(new Date() - this.time[id] <= this.rate){
      if(!this.isWait){
        this.time[id] = new Date();
      }

      return true;
    }else{
      this.time[id] = new Date();
      return false;
    }
  }

  check(id){
    if(new Date() - this.time[id] <= this.rate){
      return true;
    }else{
      return false;
    }
  }

  get(id){
    return this.time[id]||new Date();
  }
}