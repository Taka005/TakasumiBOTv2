module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationActionType } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "moderate"){
    const type = interaction.options.getString("type");

    const options = {
      "spam":{
        name: "TakasumiBOT スパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Spam,
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
      "mention":{
        name: "TakasumiBOT メンションスパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.MentionSpam,
        triggerMetadata:{
          mentionTotalLimit: 5,
          mentionRaidProtectionEnabled: true
        },
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
      "invite":{
        name: "TakasumiBOT 招待リンクをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata:{
          regexPatterns:[
            "(https?://)?(?:www.)?(?:discord.(?:gg|com/invite|me|io)|discordapp.com/invite)/[a-zA-Z0-9]"
          ]
        },
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
      "link":{
        name: "TakasumiBOT リンクをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata:{
          regexPatterns:[
            "https?://",
            "www."
          ],
          allowList:[
            "*.gif",
            "*.jpg",
            "*.jpge",
            "*.png",
            "*.webp",
            "http://tenor.com/*",
            "https://tenor.com/*"
          ]
        },
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
      "capital":{
        name: "TakasumiBOT 大文字スパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata:{
          regexPatterns:[
            "(?-i)^[A-Z\\s]+$"
          ]
        },
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
      "token":{
        name: "TakasumiBOT トークンをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata:{
          regexPatterns:[
            "\\b[0-9a-zA-Z]{24}.[0-9a-zA-Z]{6}.[0-9a-zA-Z_-]{38}\\b",
            "\\b[0-9a-zA-Z]{24}.[0-9a-zA-Z]{6}.[0-9a-zA-Z_-]{27}\\b"
          ]
        },
        actions:[{
          type: AutoModerationActionType.BlockMessage
        }],
        enabled: true
      },
    };

    const name = {
      "spam": "スパムのブロック",
      "mention": "メンションスパムのブロック",
      "invite": "招待リンクのブロック",
      "link": "URLのブロック",
      "capital": "大文字スパムのブロック",
      "token": "トークンをブロック"
    };

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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

    if(type === "reset"){
      try{
        (await interaction.guild.autoModerationRules.fetch())
          .filter(rule=>rule.creatorId === interaction.client.user.id)
          .forEach(async(rule)=>{
            await interaction.guild.autoModerationRules.delete(rule)
              .catch(()=>{});
          });

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "リセットしました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "リセット出来ませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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
      }
    }else{
      await interaction.guild.autoModerationRules.create(options[type])
        .then(async()=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${name[type]}を設定しました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: `${name[type]}を設定できませんでした  `,
                icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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
    }
  }
}