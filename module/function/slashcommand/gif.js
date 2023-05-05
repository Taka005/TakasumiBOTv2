module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  require("dotenv").config();
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "gif"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const data = await fetch(`https://g.tenor.com/v1/search?q=${name}&key=${process.env.GIF_KEY}&limit=1&media_filter=minimal`)
        .then(res=>res.json());

      const image = await fetch(data.results[0].media[0].gif.url)
        .then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "GIFを取得しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          image:{
            url: "attachment://result.gif"
          }
        }],
        files: [
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("result.gif")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "違うワードで試してください"
        }]
      });
    }
  }
}