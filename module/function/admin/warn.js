module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const fetchGuild = require("../../lib/fetchGuild");
  const config = require("../../../config.json");
  if(interaction.options.getSubcommand() === "warn"){
    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("reason");

    const guild = await fetchGuild(interaction.client,id);
    if(!guild) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "サーバーに警告できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したサーバーが存在しません"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      const owner = await guild.fetchOwner();
      await owner.send({
        embeds:[{
          color: Colors.Yellow,
          author:{
            name: "TakasumiBOTから警告されました",
            icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
          },
          description: `${reason}\n\n質問や異議申し立ては[サポートサーバー](${config.inviteUrl})まで`
        }]
      });

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${guild.name}(${guild.id})に警告しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: reason
        }]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "サーバーに警告できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }]
      });
    }
  }
}