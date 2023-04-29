module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder } = require("discord.js");
  require("dotenv").config();
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "gif"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const data = await fetch(`https://g.tenor.com/v1/search?q=${name}&key=${process.env.GIF_KEY}&limit=1&media_filter=minimal`)
        .then(res=>res.json())

      const image = await fetch(data.results[0].media[0].gif.url)
        .then(res=>res.blob())

      await interaction.editReply({
        embeds:[{
          author:{
            name: "GIFを取得しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: "GREEN",
          image:{
            url: "attachment://result.gif"
          },
        }],
        files: [new AttachmentBuilder(image.stream(),"result.gif")]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "GIFが取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "違うワードで試してください"
        }]
      });
    }
  }
}