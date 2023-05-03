module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "Pin The Message"){
    const message = interaction.options.getMessage("message");

    if(!message.content) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    if(
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)||
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります\n```メッセージの管理\nチャンネルの管理```"
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "この機能はBOTに以下の権限が必要です\n```チャンネルの閲覧\nメッセージを送信\nメッセージの管理\nチャンネルの管理```"
      }],
      ephemeral: true
    });
      
    const channel = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    const server = await db(`SELECT * FROM pin WHERE server = ${message.guild.id};`);
    if(channel[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "既にこのチャンネルにはピン留めされたメッセージが存在します\nピン留めの解除は送信された埋め込みを削除してください"
      }],
      ephemeral: true
    });

    if(server[0]?.count > 5) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "サーバーには最大5個までしかPINは使えません\nピン留めの解除は送信された埋め込みを削除してください"
      }],
      ephemeral: true
    });

    const msg = await interaction.channel.send({
      embeds:[{
        color: Colors.Green,
        author:{
          name: message.author.tag,
          icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
        },
        description: message.content,
        footer:{
          text: "TakasumiBOT PIN"
        }
      }]
    });

    await db(`INSERT INTO pin (channel, server, message, count, time) VALUES("${message.channel.id}","${message.guild.id}","${msg.id}","1", NOW());`);
    server.forEach(data=>{
      db(`UPDATE pin SET count=${Number(data.count)+1} WHERE server=${message.guild.id};`);
    });

    await interaction.deferReply()
      .then(()=>interaction.deleteReply())
  }
}