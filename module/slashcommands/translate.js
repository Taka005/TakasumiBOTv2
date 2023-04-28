module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "translate"){
    const text = interaction.options.getString("text");
    const lang = interaction.options.getString("lang");
    
    if(text > 2000) return await interaction.reply({
      embeds:[{
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "翻訳文字数は、2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.ml/images/translate.png"
        }
      }],
      ephemeral: true
    });
    
    const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&dj=1&q=${encodeURIComponent(text)}`)
      .then(res=>res.json())
  
    try{
      const translate = data.sentences.map((sentence)=>{
        return sentence.trans;
      });

      await interaction.reply({
        embeds:[{
          title: "翻訳結果",
          color: "BLUE",
          description: translate.join(""),
          footer:{
            text: `Google Translate [${data.src}]->[${lang}]`,
            icon_url: "https://cdn.taka.ml/images/translate.png"
          }
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          author:{
            name: "翻訳できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "翻訳文字を変えて、もう一度実行してください",
          footer:{
            text: "Google Translate",
            icon_url: "https://cdn.taka.ml/images/translate.png"
          }
        }],
        ephemeral: true
      });
    }
  }
}