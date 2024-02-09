module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const isUrl = require("../../lib/isUrl");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "webshot"){
    const url = interaction.options.getString("url");

    if(!isUrl(url)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "URLを指定する必要があります"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      const data = await fetch("https://securl.nu/jx/get_page_jx.php",{
        "method": "POST",
        "headers":{
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "body": `url=${url}&waitTime=1&browserWidth=1000&browserHeight=1000`
      }).then(res=>res.json());

      const image = await fetch(`https://securl.nu${data.img}`)
        .then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "取得しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          image:{
            url: "attachment://screenshot.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("screenshot.png")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "URLを変えてやり直してください"
        }],
        ephemeral: true
      });
    }
  }
}