module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const translate = require("../../lib/translate");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "translate"){
    const text = interaction.options.getString("text");
    const lang = interaction.options.getString("lang");

    if(text > 2000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "翻訳文字数は、2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.cf/images/translate.png"
        }
      }],
      ephemeral: true
    });

    try{
      const data = await translate(encodeURIComponent(text),"auto",lang);

      await interaction.reply({
        embeds:[{
          color: Colors.Blue,
          title: "翻訳結果",
          description: data.text,
          footer:{
            text: `Google Translate [${data.source}]->[${lang}]`,
            icon_url: "https://cdn.taka.cf/images/translate.png"
          }
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "翻訳できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "翻訳文字を変えて、もう一度実行してください",
          footer:{
            text: "Google Translate",
            icon_url: "https://cdn.taka.cf/images/translate.png"
          }
        }],
        ephemeral: true
      });
    }
  }
}