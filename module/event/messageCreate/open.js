module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const limit = require("../../lib/limit");
  const fetchChannel = require("../../lib/fetchChannel");
  const fetchMessage = require("../../lib/fetchMessage");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;
  
  const link = message.content.match(/^https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/(\d+)\/(\d+)\/(\d+)$/);
  if(link){
    const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${message.guild.id} LIMIT 1;`);
    if(ignore[0]||limit(message)) return;

    const channel = await fetchChannel(message.client,link[2]);
    const msg = await fetchMessage(channel,link[3]);
    if(!channel||!msg) return;

    if(!msg.attachments.first()){
      await message.channel.send({//添付ファイルなし
        embeds:[{
          color: Colors.Green,
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||msg.author.defaultAvatarURL,
          },
          description: msg.content || "メッセージ内容がありません",
          footer:{
            text: `#${msg.channel.name}`
          },
          timestamp: msg.createdAt
        }]
      });
    }else if(msg.attachments.first().height && msg.attachments.first().width){
      const attachment = msg.attachments.map(attachment=>attachment.url)
      await message.channel.send({//添付ファイルあり(画像)
        embeds:[{
          color: Colors.Green,
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||msg.author.defaultAvatarURL,
          },
          description: msg.content || "メッセージ内容がありません",
          image:{
            url: attachment[0]
          },
          footer:{
            text: `#${msg.channel.name}`
          },
          timestamp: msg.createdAt
        }]
      });
    }else{
      const attachment = msg.attachments.map(attachment=>attachment.url)
      await message.channel.send({//添付ファイルあり(画像以外)
        embeds:[{
          color: Colors.Green,
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||msg.author.defaultAvatarURL,
          },
          description: msg.content || "メッセージ内容がありません",
          footer:{
            text: `#${msg.channel.name}`
          },
          fields:[
            {
              name: "添付ファイル",
              value: `${attachment[0]||"エラー"}`
            }
          ],
          timestamp: msg.createdAt
        }]
      });
    }
  }
}