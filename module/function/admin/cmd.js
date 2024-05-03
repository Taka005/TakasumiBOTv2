module.exports = async(interaction)=>{
  const { AttachmentBuilder } = require("discord.js");
  const { execSync } = require("child_process");
  if(interaction.options.getSubcommand() === "cmd"){
    const code = interaction.options.getString("code");

    await interaction.deferReply();
    try{
      const data = execSync(code,{
        timeout: 10000
      });

      await interaction.editReply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(data.toString(),"UTF-8"))
            .setName("cmd.txt")
        ]
      });
    }catch(error){
      await interaction.editReply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(error.toString(),"UTF-8"))
            .setName("cmd.txt")
        ]
      });
    }
  }
}