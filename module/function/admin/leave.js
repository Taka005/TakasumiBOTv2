module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const fetchGuild = require("../../lib/fetchGuild");
  if(interaction.options.getSubcommand() === "leave"){
    const id = interaction.options.getString("id");

    const guild = await fetchGuild(interaction.client,id);
    if(!guild) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "サーバーから脱退できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したサーバーが存在しません"
      }],
      ephemeral: true
    });

    try{
      await guild.leave();

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${guild.name}(${guild.id}) から脱退しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "サーバーから脱退できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        ephemeral: true
      });
    }
  }
}