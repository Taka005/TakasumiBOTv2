module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "Make it a Quote"){
    const message = interaction.options.getMessage("message");

    if(!message.cleanContent) return await interaction.reply({
      embeds:[{
        author:{
          name: "生成できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    await interaction.editReply("生成中...");

    const image = await fetch(`${config.api.miq}/?name=${message.author.username}&id=${message.author.id}&content=${message.cleanContent.replace("#","＃")}&icon=${message.author.avatarURL({extension:"png",size:1024})||message.author.defaultAvatarURL}`)
      .then(res=>res.blob());

    await interaction.editReply({
      content: `[生成元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
      files:[
        new AttachmentBuilder()
          .setFile(image.stream())
          .setName("TakasumiBOT_Quote.png")
      ]
    });
  }
}