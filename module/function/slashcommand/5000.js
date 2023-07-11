module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "5000"){
    const top = interaction.options.getString("top");
    const bottom = interaction.options.getString("bottom");

    await interaction.deferReply();
    try{
      const image = await fetch(`https://gsapi.cbrx.io/image?top=${top}&bottom=${bottom}&type=png`)
        .then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "生成しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          image:{
            url: "attachment://5000.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("5000.png")
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "もう一度やり直してください"
        }]
      });
    }
  }
}