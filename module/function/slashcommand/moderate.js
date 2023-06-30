module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationActionType } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "moderate"){
    const type = interaction.options.getString("type");

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```サーバーの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageGuild)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "この機能はBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```サーバーの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(type === "spam"){
      await interaction.guild.autoModerationRules.create({
        name: "スパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Spam,
        actions: [{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      })
      .then(async()=>{    
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
           author:{
              name: "スパム検知を設定しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "設定出来ませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
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
                  .setStyle(ButtonStyle.Link))
          ],
          ephemeral: true
        });
      });
    }else{
      
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "モデレート機能を設定しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          }
        }]
      });
    }
  }
}