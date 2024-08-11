module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors } = require("discord.js");
  const { execSync } = require("child_process");
  if(interaction.options.getSubcommand() === "cmd"){
    const code = interaction.options.getString("code");

    await interaction.deferReply();
    try{
      const data = execSync(code,{
        timeout: 10000
      });

      try{
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "実行しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `\`\`\`${data.toString()}\`\`\``
          }]
        });
      }catch{
        await interaction.editReply({
          files:[
            new AttachmentBuilder()
              .setFile(Buffer.from(data.toString(),"UTF-8"))
              .setName("cmd.txt")
          ]
        });
      }
    }catch(error){
      try{
        await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "実行できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: `\`\`\`${error.toString()}\`\`\``
          }]
        });
      }catch{
        await interaction.editReply({
          files:[
            new AttachmentBuilder()
              .setFile(Buffer.from(error.toString(),"UTF-8"))
              .setName("error.txt")
          ]
        });
      }
    }
  }
}