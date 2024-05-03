module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchMember = require("../../lib/fetchMember");
  if(interaction.options.getSubcommand() === "dissoku"){
    const role = interaction.options.getRole("role");

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージの送信```",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージの送信```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!role){
      const data = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id};`);
      if(!data[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "通知ロールを無効にできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "通知ロールが設定されていません"
        }],
        ephemeral: true
      });

      await db(`DELETE FROM dissoku WHERE id = ${interaction.guild.id};`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "通知ロールを無効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else{
      const bot = await fetchMember(interaction.guild,"761562078095867916");
      if(!bot) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "通知ロールを有効にできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このサーバーにDissokuが参加していません"
        }],
        ephemeral: true
      });

      await db(`INSERT INTO dissoku (id, role, time) VALUES("${interaction.guild.id}","${role.id}",NOW()) ON DUPLICATE KEY UPDATE id = VALUES (id),role = VALUES (role),time = VALUES (time);`);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "通知ロールを有効にしました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `Dissoku通知に<@&${role.id}>に設定しました`
        }]
      });
    }
  }
}