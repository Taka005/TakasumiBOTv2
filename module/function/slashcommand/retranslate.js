module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "retranslate"){
    let text = interaction.options.getString("text");
    
    if(text > 2000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "再翻訳できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "再翻訳文字数は、2000文字以下です"
      }],
      ephemeral: true
    });

    try{
      Promise.all(["en","ko","id","el","zh","th","es","ru","ja","en","cs","el","id","th","zh","en","it","ko","es","ja","th","en","el","id","ko","it","en","zh","th","id"]
        .map(async(lang)=>{
          const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&dj=1&q=${encodeURIComponent(text)}`)
            .then(res=>res.json());
          text = data.sentences.map(sentence=>sentence.trans).join("");
        }))
        .then(async()=>{
          const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&dj=1&q=${encodeURIComponent(text)}`)
            .then(res=>res.json());
          text = data.sentences.map(sentence=>sentence.trans).join("");

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              title: "再翻訳結果",
              description: text
            }]
          });
        });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "再翻訳できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "再翻訳文字を変えて、もう一度実行してください"
        }],
        ephemeral: true
      });
    }
  }
}