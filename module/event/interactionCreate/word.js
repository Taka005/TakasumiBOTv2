module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const words = require("../../../file/words");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("word_")){
    const data = interaction.customId.split("_");
    const text = interaction.fields.getTextInputValue("text");

    const target = words.find(word=>word.index === Number(data[2]));

    let result;
    if(data[1] === "en"){
      result = target.ja.includes(text);
    }else{
      result = target.en === text;
    }

    if(result){
      await money.add(interaction.user.id,100,"ゲームの賞金");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "正解しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: "100コイン取得しました",
          fields:[
            {
              name: target.en,
              value: target.ja.join("\n")
            }
          ]
        }]
      });
    }else{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "正解しませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: target.en,
              value: target.ja.join("\n")
            }
          ]
        }]
      });
    }
  }
}