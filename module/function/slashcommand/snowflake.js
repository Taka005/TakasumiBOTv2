module.exports = async(interaction)=>{
  const { SnowflakeUtil, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "snowflake"){
    const id = interaction.options.getString("id");

    if(isNaN(id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "解析できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "Snowflakeは数字で指定する必要があります"
      }],
      ephemeral: true
    });

    try{
      const snowflake = SnowflakeUtil.deconstruct(id);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "解析しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `Date: ${new Date(Number(snowflake.timestamp)).toLocaleString()}\nWorkerID: ${snowflake.workerId}\nProcessID: ${snowflake.processId}\nIncrement: ${snowflake.increment}`
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "解析できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error.stack}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}