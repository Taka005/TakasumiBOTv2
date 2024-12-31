module.exports = async(interaction)=>{
  const { Colors, AttachmentBuilder } = require("discord.js");
  const fetch = require("node-fetch");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "graph"){
    const formula = [
      interaction.options.getString("formula_1"),
      interaction.options.getString("formula_2"),
      interaction.options.getString("formula_3")
    ].filter(f=>f!==null).join(",");

    return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "生成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "この機能はメンテナンス中です"
      }]
    });

    await interaction.deferReply();
    try{
      const image = await fetch(`${config.api.graph}/?formula=${formula}`)
        .then(async(res)=>{
          if(!res.ok) throw new Error();
          return await res.blob();
        });

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "生成しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          image:{
            url: "attachment://graph.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("graph.png")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "数式を変えてやり直してください"
        }]
      });
    }
  }
}