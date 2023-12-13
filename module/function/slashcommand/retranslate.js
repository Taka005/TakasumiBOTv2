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

    await interaction.deferReply();
    try{
      const langs = ["ja","en","es","fr","zh","ru","ko"];

      for(let i = 0;i<50;i++){
        text = (await translate(text,"auto",langs[i%7])).text;
      }

      text = (await translate(text,"auto","ja")).text;

      await interaction.editReply({
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
      await interaction.editReply({
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