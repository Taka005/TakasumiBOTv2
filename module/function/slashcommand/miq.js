module.exports = async(interaction)=>{
  const { Colors, AttachmentBuilder } = require("discord.js");
  const fetch = require("node-fetch");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "miq"){
    const type = interaction.options.getString("type");
    const user = interaction.options.getUser("user");
    const text = interaction.options.getString("text");

    await interaction.deferReply();
    try{
      const image = await fetch(`${config.api.miq}/?type=${type}&name=${user.username}&id=${interaction.user.id}&content=${text.replace("#","＃")}&icon=${user.avatarURL({extension:"png",size:1024})||user.defaultAvatarURL}`)
        .then(res=>res.blob());

      await interaction.editReply({
        files:[
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("TakasumiBOT_MIQ.png")
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "テキストを変えてやり直してください"
        }]
      });
    }
  }
}