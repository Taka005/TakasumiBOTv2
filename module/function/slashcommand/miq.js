module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const { AttachmentBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "miq"){
    const text = interaction.options.getString("text");
  
    await interaction.deferReply();
    try{
      const image = await fetch(`https://miq-api.tuna2134.jp/?name=${interaction.user.username}&tag=${interaction.user.discriminator}&id=${interaction.user.id}&content=${text}&icon=${interaction.user.avatarURL({extension:"png",size:1024})}`)
        .then(res=>res.blob())
  
      await interaction.editReply({
        files: [
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("miq.png")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "テキストを変えてやり直してください"
        }]
      });
    }
  }
}