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
        name: "TakasumiBOT スパムをブロック",
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
                name: "スパムのブロックを設定しました",
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
    }else if(type === "mention"){
      await interaction.guild.autoModerationRules.create({
        name: "TakasumiBOT メンションスパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.MentionSpam,
        triggerMetadata: {
          mentionTotalLimit: 5,
          mentionRaidProtectionEnabled: true
        },
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
                name: "メンションスパムのブロックを設定しました",
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
    }else if(type === "invite"){
      await interaction.guild.autoModerationRules.create({
        name: "TakasumiBOT 招待リンクをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata: {
          regexPatterns: [
            "discord(?:.com|app.com|.gg)[/invite/]?(?:[a-zA-Z0-9-]{2,32})"
          ]
        },
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
                name: "招待リンクのブロックを設定しました",
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
    }else if(type === "link"){
      await interaction.guild.autoModerationRules.create({
        name: "TakasumiBOT リンクをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata: {
          regexPatterns: [
            "https?://",
            "www."
          ],
          allowList: [
            "*.gif",
            "*.jpg",
            "*.jpge",
            "*.png",
            "*.webp",
            "http://tenor.com/*",
            "https://tenor.com/*"
          ]
        },
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
                name: "リンクのブロックを設定しました",
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
    }else if(type === "capital"){
      await interaction.guild.autoModerationRules.create({
        name: "TakasumiBOT 大文字スパムをブロック",
        eventType: AutoModerationRuleEventType.MessageSend,
        triggerType: AutoModerationRuleTriggerType.Keyword,
        triggerMetadata: {
          regexPatterns: [
            "(?-i)^[A-Z\\s]+$"
          ]
        },
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
                name: "大文字スパムのブロックを設定しました",
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
    }else if(type === "reset"){
      try{
        const rules = await interaction.guild.autoModerationRules.fetch();
        rules.filter(rule=>rule.name.startsWith("TakasumiBOT")).forEach(async(rule)=>{
          await interaction.guild.autoModerationRules.delete(rule);
        });

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "リセットしました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "リセット出来ませんでした",
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
      }
    }
  }
}