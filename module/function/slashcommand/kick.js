module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const fetchMember = require("../../lib/fetchMember");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "kick"){
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason")||`${interaction.user.tag}によってKICK`;
    
    if(!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをKICK```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.KickMembers)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```メンバーをKICK```"
          }
        ]
      }],
      ephemeral: true
    });

    const member = await fetchMember(interaction.guild,user.id);
    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "キックできませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "指定したユーザーが取得できません"
      }],
      ephemeral: true
    });

    if(member.user.id === interaction.user.id) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "キックできませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "自分自身をキックすることはできません"
      }],
      ephemeral: true
    });

    await member.kick({reason:`${reason}`})
      .then(async()=>{
        await interaction.reply({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${member.user.tag}(${member.user.id})をサーバーからキックしました`,
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        })
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "キックできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
        })
      })
  }
}