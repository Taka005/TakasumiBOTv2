module.exports = async(interaction,client)=>{
  const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ban"){
    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("reason")||`${interaction.user.tag}によってBAN`;
    const days = interaction.options.getInteger("days");
    
    if(!interaction.member.permissions.has("BAN_MEMBERS")) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
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

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has("BAN_MEMBERS")) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
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

    const ID = id.match(/\d{18,19}/g);
    if(!ID) return await interaction.reply({
      embeds:[{
        author:{
          name: "BANできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "正確にID又は、メンションをしてください"
      }],
      ephemeral: true
    });

    if(ID[0] === interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "BANできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "自分自身をBANすることはできません"
      }],
      ephemeral: true
    });

    let user;
    try{
      user = await client.users.fetch(ID[0]);
    }catch{
      return await interaction.reply({
        embeds:[{
          author:{
            name: "BANできませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "指定したユーザーが存在しません"
        }],
        ephemeral: true
      });
    }
    
    if(days){
      await interaction.guild.bans.create(ID[0],{
        "reason": reason,
        "deleteMessageSeconds": days*86400
      })
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              author:{
                name: `${user.tag} をサーバーからBANしました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              author:{
                name: "BANできませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              color: "RED",
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
    }else{
      await interaction.guild.bans.create(ID[0],{
        "reason": reason 
      })
        .then(async()=>{
          await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds:[{
              author:{
                name: `${user.tag} をサーバーからBANしました`,
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              author:{
                name: "BANできませんでした",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              color: "RED",
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
          });
        })
    }
  }
}