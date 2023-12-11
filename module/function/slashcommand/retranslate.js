module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const translate = require("../../lib/translate");
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
          text = (await translate(encodeURIComponent(text),"auto",lang)).text;
        }))
        .then(async()=>{
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