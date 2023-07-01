module.exports = class Spam{
  constructor(rate){
    this.time = [];
    this.rate = rate;
  }

  count(id){
    if(new Date() - this.time[id] <= this.rate){
      this.time[id] = new Date();
      return true;
    }else{
      this.time[id] = new Date();
      return false;
    }
  }
}