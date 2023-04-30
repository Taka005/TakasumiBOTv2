module.exports = async(interaction)=>{
  const isUrl = require("../../lib/isUrl");
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "webshot"){
    const url = interaction.options.getString("url");

    if(!isUrl(url)) return await interaction.reply({
      embeds:[{
        author:{
          name: "スクリーンショットできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "URLを指定する必要があります"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      const data = await fetch(`https://api.popcat.xyz/screenshot?url=${url}`)
        .then(res=>res.blob())

      await interaction.editReply({
        embeds:[{
          author:{
            name: "スクリーンショットを撮りました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green,
          image:{
            url: "attachment://screenshot.png"
          },
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
          author:{
            name: "スクリーンショットできませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "URLを変えてやり直してください"
        }],
        ephemeral: true
      });
    }
  }
}