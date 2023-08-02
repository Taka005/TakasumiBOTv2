module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors } = require("discord.js");
  const { execSync } = require("child_process")
  const { admin } = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "cmd"){
    const code = interaction.options.getString("code");

    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      const data = execSync(code,{
        timeout: 10000,
      });

      await interaction.editReply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(data,"UTF-8")) 
            .setName("cmd.json")
        ]
      });
    }catch(error){
      await interaction.editReply({ 
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(error.toString(),"UTF-8")) 
            .setName("cmd.json")
        ]
      });
    }
    
  }
}