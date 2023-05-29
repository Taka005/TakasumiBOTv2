module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "translate"){
    const text = interaction.options.getString("text");
    const lang = interaction.options.getString("lang");
    
    if(text > 2000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "翻訳文字数は、2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.ml/images/translate.png"
        }
      }],
      ephemeral: true
    });
    
    const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&dj=1&q=${encodeURIComponent(text)}`)
      .then(res=>res.json());
  
    try{
      const translate = data.sentences.map((sentence)=>{
        return sentence.trans;
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Blue,
          title: "翻訳結果",
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
          color: Colors.Red,
          author:{
            name: "翻訳できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
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