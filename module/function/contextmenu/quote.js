module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "Make it a Quote"){
    const message = interaction.options.getMessage("message");
    
    if(!message.cleanContent) return await interaction.reply({
      embeds:[{
        author:{
          name: "生成できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    await interaction.editReply("生成中...");

    const image = await fetch(`http://localhost:3000/?name=${message.author.username}&tag=${message.author.discriminator}&id=${message.author.id}&content=${message.cleanContent}&icon=${message.author.avatarURL({extension:"png",size:1024})}`)
      .then(res=>res.blob());
    
    await interaction.editReply({ 
      content: `[生成元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
      files: [
        new AttachmentBuilder()
          .setFile(image.stream())
          .setName("TakasumiBOT_Quote.png")
      ]
    }); 
  }
}