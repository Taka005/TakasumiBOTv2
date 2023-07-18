module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "retranslate"){
    const text = interaction.options.getString("text");
    
    if(text > 2000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "再翻訳できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "再翻訳文字数は、2000文字以下です"
      }],
      ephemeral: true
    });

    try{
      let text;
      Array(10).map(async(e,i)=>{
        if(i%2 === 0){
          const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&dj=1&q=${encodeURIComponent(text)}`)
            .then(res=>res.json());
          text = data.sentences.map(sentence=>sentence.trans).join("");
        }else{
          const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dj=1&q=${encodeURIComponent(text)}`)
            .then(res=>res.json());
          text = data.sentences.map(sentence=>sentence.trans).join("");
        }
        console.log(text)
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: "再翻訳結果",
          description: text
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "再翻訳できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "再翻訳文字を変えて、もう一度実行してください"
        }],
        ephemeral: true
      });
    }
  }
}