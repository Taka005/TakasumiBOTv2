module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const lang = require("../../lib/lang");
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
            name: await lang(interaction.guild.id,"command.5000.generated"),
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green,
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
          color: Colors.Red,
          description: "もう一度やり直してください"
        }]
      });
    }
  }
}