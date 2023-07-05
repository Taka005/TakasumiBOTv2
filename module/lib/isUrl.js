module.exports = (url)=>{
  if(url.match(/^(http(s)?:\/\/)?[^\s]+\.[^\s]+$/)){
    return true;
  }else{
    return false;
  }
}