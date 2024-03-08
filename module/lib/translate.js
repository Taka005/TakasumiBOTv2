module.exports = async(text,source,target)=>{
  const fetch = require("node-fetch");

  const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&dj=1&q=${encodeURIComponent(text)}`)
    .then(res=>res.json());

  return {
    "text": data.sentences.map(sentence=>sentence.trans).join(""),
    "source": data.src
  }
}