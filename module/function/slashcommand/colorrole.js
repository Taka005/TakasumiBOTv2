module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "colorrole"){
    const name = interaction.options.getString("name");
    const color = interaction.options.getString("color");

    if(!interaction.member.permissions.has("MANAGE_ROLES")) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドを実行するには以下のの権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_ROLES")) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    await interaction.guild.roles.create({
      name: name,
      color: color,
      position: interaction.guild.members.me.roles.highest.position,
      mentionable: false,
      reason: "色付きロールの作成",
    })
    .then(async(role)=>{
      await interaction.reply({
        embeds:[{
          author:{
            name: "ロールを作成しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `作成したロール:${role}`,
          color: "GREEN"
        }]
      });
    })
    .catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          author:{
            name: "ロールを作成できませんでした",
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
    })
  }
}