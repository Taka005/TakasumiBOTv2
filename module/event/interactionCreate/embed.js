module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const isUrl = require("../../lib/isUrl");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId === "embed"){
    const title = interaction.fields.getTextInputValue("title");
    const description = interaction.fields.getTextInputValue("description");
    const image = interaction.fields.getTextInputValue("image");

    if(!title&&!description&&!image) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "入力箇所が不足しています",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "記入欄を全て空にはできません"
      }],
      ephemeral: true
    });

    if(image&&!isUrl(image)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "入力された画像が無効です",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "画像はURLで指定する必要があります"
      }],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        title: title,
        description: description,
        image:{
          url: image
        }
      }]
    });
  }
}