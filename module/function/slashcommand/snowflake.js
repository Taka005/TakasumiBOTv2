module.exports = async(interaction)=>{
  const { SnowflakeUtil, ButtonBuilder, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "snowflake"){
    const id = interaction.options.getString("id");

    if(isNaN(id)) return await interaction.reply({
      embeds:[{
        author:{
          name: "解析できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "Snowflakeは数字で指定する必要があります"
      }],
      ephemeral: true
    });

    try{
      const snowflake = SnowflakeUtil.deconstruct(id);

      await interaction.reply({
        embeds:[{
          author:{
            name: "解析しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `タイムスタンプ: ${snowflake.timestamp}\n日付: ${snowflake.date}\nワーカーID: ${snowflake.workerId}\nプロセスID: ${snowflake.processId}\nインクリメント: ${snowflake.increment}\nバイナリー: ${snowflake.binary}`,
          color: "GREEN"
        }]
      })
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "解析できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle("LINK"))
        ],
        ephemeral: true
      });
    }
  }
}