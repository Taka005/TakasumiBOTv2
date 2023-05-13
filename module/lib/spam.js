module.exports = class Spam{
  constructor(){
    this.time = [];
    this.send = [];
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