module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const words = require("../../../file/words");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("word_")){
    const data = interaction.customId.split("_");
    const text = interaction.fields.getTextInputValue("text");

    const target = words.find(word=>word.index === Number(data[2]));

    const result = data[1] === "en" ? target.ja.includes(text) : target.en === text;

    if(result){
      await money.add(interaction.user.id,150,"ゲームの賞金");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "正解しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: "150コイン取得しました",
          fields:[
            {
              name: "あなたの回答",
              value: text
            },
            {
              name: "英語",
              value: target.en
            },
            {
              name: "日本語",
              value: target.ja.join("\n")
            }
          ]
        }]
      });
    }else{
      await money.add(interaction.user.id,10,"ゲームの参加賞");

      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "正解しませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "10コイン獲得しました",
          fields:[
            {
              name: "あなたの回答",
              value: text
            },
            {
              name: "英語",
              value: target.en
            },
            {
              name: "日本語",
              value: target.ja.join("\n")
            }
          ]
        }]
      });
    }
  }
}