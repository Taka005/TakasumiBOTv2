module.exports = (url)=>{
  if(
    typeof url !== "string"||
    !url.match(/https?/)
  ) return false;

  if(url.match(/^(http(s)?:\/\/)?[^\s]+\.[^\s]+$/)) return true;

  return false;
}