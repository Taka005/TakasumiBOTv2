module.exports = async(interaction)=>{
  const isUrl = require("../../lib/isUrl");
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "webshot"){
    const url = interaction.options.getString("url");

    if(!isUrl(url)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "撮影できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "URLを指定する必要があります"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      const data = await fetch(`https://api.popcat.xyz/screenshot?url=${url}`)
        .then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "撮影しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          image:{
            url: "attachment://screenshot.png"
          }
        }],
        files: [
          new AttachmentBuilder()
            .setFile(data.stream())
            .setName("screenshot.png")
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "スクリーンショットを撮れませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "URLを変えてやり直してください"
        }],
        ephemeral: true
      });
    }
  }
}