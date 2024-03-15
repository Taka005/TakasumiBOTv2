module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "up"){

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.CreateInstantInvite)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```招待リンクの作成```"
          }
        ]
      }],
      ephemeral: true
    });

    const data = await db(`SELECT * FROM server WHERE id = ${interaction.guild.id};`);
    if(!data[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "UPできませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "まだ登録されていません\n`/register`を使用して登録してください"
      }],
      ephemeral: true
    });

    if(new Date() - new Date(data[0].time) < 3600000) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "UPできませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: `このサーバーを上げられるようになるまであと${Math.floor((3600000 - (new Date() - new Date(data[0].time)))/60000)}分です`
      }],
      ephemeral: true
    });

    await db(`UPDATE server SET name = "${interaction.guild.name}", count = "${interaction.guild.memberCount}", icon = "${interaction.guild.iconURL({extension:"png",size:1024})||"https://cdn.discordapp.com/embed/avatars/0.png"}", time = NOW() WHERE id = ${interaction.guild.id}`);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "UPしました!",
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        image:{
          url: "https://cdn.takasumibot.com/images/up.gif"
        },
        description: "表示順位が更新されました\n[サーバー掲示板](https://servers.takasumibot.com/)で確認してね!\n1時間後に通知します"
      }]
    });
  }
}