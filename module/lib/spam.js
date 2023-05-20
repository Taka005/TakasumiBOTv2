module.exports = class Spam{
  constructor(rate){
    this.time = [];
    this.send = [];
    this.rate = rate;
  }

  count(id){
    if(new Date() - this.time[id] <= this.rate){
      this.time[id] = new Date();
      return true;
    }else{
      this.time[id] = new Date();
      delete this.send[id];
      return false;
    }
  }

  check(id){
    if(this.send([id])) return false;

    this.send[id] = true;
    return true;
  }
}