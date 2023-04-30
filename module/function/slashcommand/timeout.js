module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, PermissionFlagsBits, Colors } = require("discord.js");
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === "timeout"){
      const user = interaction.options.getUser("user");
      const time = interaction.options.getInteger("time")||30
      const reason = interaction.options.getString("reason")||`${interaction.user.tag}によってタイムアウト`;
      
      if(!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({
        embeds:[{
          author:{
            name: "権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "このコマンドを実行するには以下の権限を持っている必要があります",
          fields:[
            {
              name: "必要な権限",
              value: "```メンバーをモデレート```"
            }
          ]
        }],
        ephemeral: true
      });
  
      if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ModerateMembers)) return await interaction.reply({
        embeds:[{
          author:{
            name: "BOTに権限がありません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "このコマンドはBOTに以下の権限が必要です",
          fields:[
            {
              name: "必要な権限",
              value: "```メンバーをモデレート```"
            }
          ]
        }],
        ephemeral: true
      });
  
      const member = await interaction.guild.members.cache.get(user.id);
      if(!member) return await interaction.reply({
        embeds:[{
          author:{
            name: "タイムアウトできませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "ユーザーが取得できません"
        }],
        ephemeral: true
      });
  
      if(member.user.id === interaction.user.id) return await interaction.reply({
        embeds:[{
          author:{
            name: "タイムアウトできませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "自分自身をタイムアウトすることはできません"
        }],
        ephemeral: true
      });
  
      await member.timeout(time*1000,reason)
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              author:{
                name: `${member.user.tag}を${time}秒タイムアウトしました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: Colors.Green
            }]
          })
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              author:{
                name: "タイムアウトできませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              color: Colors.Red,
              description: "BOTの権限が不足しているか、メンバーが正しく指定されていません",
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
          })
        })
    }
  }