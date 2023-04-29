const time = [];
module.exports = class Spam{
  constructor(rate){
    this.rate = rate;
  }

  count(id){
    if(new Date() - time[id] <= this.rate){
      time[id] = new Date();
      return true
    }else{
      time[id] = new Date();
      return false
    }
  }
}