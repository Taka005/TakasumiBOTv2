module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "5000"){
    const top = interaction.options.getString("top");
    const bottom = interaction.options.getString("bottom");

    await interaction.deferReply();
    try{
      let image;
      if(bottom){
        image = await fetch(`https://gsapi.cbrx.io/image?top=${top}&bottom=${bottom}&type=png`)
          .then(res=>res.blob())
      }else{
        image = await fetch(`https://gsapi.cbrx.io/image?top=${top}&bottom=欲しい!&hoshii=true&type=png`)
          .then(res=>res.blob())
      }    

      await interaction.editReply({
        embeds:[{
          author:{
            name: "生成しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: "GREEN",
          image:{
            url: "attachment://5000.png"
          },
        }],
        files: [
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("5000.png")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "生成出来ませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "もう一度やり直してください"
        }]
      });
    }
  }
}