module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const fetchMember = require("../../lib/fetchMember");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "warn"){
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

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

    const member = await fetchMember(interaction.guild,user.id);
    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "警告できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したユーザーが取得できません"
      }],
      ephemeral: true
    });

    if(member.user.id === interaction.user.id) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "警告できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "自分自身を警告することはできません"
      }],
      ephemeral: true
    });

    try{
      await member.user.send({
        embeds:[{
          color: Colors.Yellow,
          author:{
            name: "警告されました",
            icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
          },
          description: reason,
          footer:{
            text: `${interaction.guild.name}(${interaction.guild.id})`,
            icon_url: interaction.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
          timestamp: new Date()
        }]
      });

      await interaction.reply({
        content: `<@${interaction.user.id}>`,
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${member.user.tag}を警告しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `理由: ${reason}`
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "警告できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "ユーザーがDMを拒否している可能性があります",
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
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}