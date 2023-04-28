module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { MessageAttachment } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "miq"){
    const text = interaction.options.getString("text");
  
    await interaction.deferReply();
    try{
      const image = await fetch(`https://miq-api.tuna2134.jp/?name=${interaction.user.username}&tag=${interaction.user.discriminator}&id=${interaction.user.id}&content=${text}&icon=${interaction.user.avatarURL({format:"png",size:1024})}`)
        .then(res=>res.blob())
  
      await interaction.editReply({
        files: [new MessageAttachment(image.stream(),"miq.png")]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "テキストを変えてやり直してください"
        }]
      });
    }
  }
}