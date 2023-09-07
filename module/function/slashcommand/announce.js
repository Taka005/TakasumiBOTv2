module.exports = async(interaction)=>{
  const { ChannelType, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "announce"){

    if(
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)||
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
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
            value: "```チャンネルの管理\nメッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });
  
    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.AddReactions)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
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
            value: "```チャンネルの閲覧\nチャンネルの管理\nリアクションの追加\nメッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });
  
    const channel = await db(`SELECT * FROM announce WHERE channel = ${interaction.channel.id} LIMIT 1;`);
    if(channel[0]){
      await db(`DELETE FROM announce WHERE channel = ${interaction.channel.id} LIMIT 1;`);
      await db(`UPDATE announce SET count = ${Number(data.count)-1} WHERE server = ${interaction.guild.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "アナウンスの自動公開を無効にしました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          }
        }]
      });
    }else{
      const server = await db(`SELECT * FROM announce WHERE server = ${interaction.guild.id};`);
      if(server[0]?.count > 5) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "アナウンスの自動公開を設定できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "サーバーには最大6個までしか設定できません"
        }],
        ephemeral: true
      });

      if(interaction.channel.type !== ChannelType.GuildAnnouncement) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "アナウンスの自動公開を設定できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "設定するチャンネルはアナウンスチャンネルにしてください"
        }],
        ephemeral: true
      });  
  
      await db(`INSERT INTO announce (channel, server, count, time) VALUES("${interaction.channel.id}","${interaction.guild.id}","${server[0]?.count||"0"}",NOW());`);
      await db(`UPDATE announce SET count = ${Number(data.count)+1} WHERE server = ${interaction.guild.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "アナウンスの自動公開を設定にしました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          }
        }]
      });
    }
  }
}