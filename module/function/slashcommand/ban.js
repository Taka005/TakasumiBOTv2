module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ban"){
    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("reason")||`${interaction.user.tag}によってBAN`;
    const days = interaction.options.getInteger("days");
    
    if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持ってる必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをBAN```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.BanMembers)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です\n```メンバーをBAN```",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをBAN```"
          }
        ]
      }],
      ephemeral: true
    });

    const userId = id.match(/\d{18,19}/g);
    if(!userId) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BANできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "ユーザーID、メンションを入力してください"
      }],
      ephemeral: true
    });

    const user = await fetchUser(interaction.client,userId[0]);
    if(!user) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BANできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定したユーザーが存在しません"
      }],
      ephemeral: true
    });

    if(user.id === interaction.user.id) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BANできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "自分自身をBANすることはできません"
      }],
      ephemeral: true
    });
    
    if(days){
      await interaction.guild.bans.create(user.id,{
        "reason": reason,
        "deleteMessageSeconds": days*86400
      })
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${user.tag}(${user.id}) をサーバーからBANしました`,
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
                name: "BANできませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
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
                    .setStyle(ButtonStyle.Link))
            ],
            ephemeral: true
          });
        });
    }else{
      await interaction.guild.bans.create(user.id,{
        "reason": reason 
      })
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${user.tag}(${user.id}) をサーバーからBANしました`,
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
                name: "BANできませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
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
                    .setStyle(ButtonStyle.Link))
            ],
            ephemeral: true
          });
        })
    }
  }
}