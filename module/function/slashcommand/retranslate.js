module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const translate = require("../../lib/translate");
  const random = require("../../lib/random");
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
      const langs = ["ja","en","es","fr","zh","ru","ko"];
      
      await Promise.all(Array.apply(null,{length: 50}).map(async()=>{
        text = (await translate(encodeURIComponent(text),"auto",random(langs))).text;
      }));

      text = (await translate(encodeURIComponent(text),"auto","ja")).text;

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "再翻訳しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: text
        }]
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