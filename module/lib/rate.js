module.exports = (op_1,op_2,number)=>{
  if(Math.random() < number){
    return op_2;
  }else{
    return op_1;
  }
}