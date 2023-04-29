module.exports = async(message,client)=>{
  const db = require("../../lib/db");
  const limit = require("../../lib/limit");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has("VIEW_CHANNEL")||
    !message.guild.members.me.permissionsIn(message.channel).has("SEND_MESSAGES")
  ) return;
  
  if(message.content.match(/https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/\d{18,19}\/\d{18,19}\/\d{18,19}/g)){
    const url = message.content.match(/(https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/)(\d{18,19}\/\d{18,19}\/\d{18,19})/);

    const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${message.guild.id} LIMIT 1;`);
    if(ignore[0]||limit(message)) return;

    const id = url[2].split("/");
    const channel = client.channels.cache.get(id[1]);
    if(!channel) return;
    const msg = await channel.messages.fetch(id[2])
      .catch(()=>{})

    if(!msg.attachments?.first()){
      message.channel.send({//添付ファイルなし
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          description: msg.content || "メッセージ内容がありません",
          footer:{
            text: `#${msg.channel.name}`
          },
          timestamp: msg.createdAt
        }]
      });
    }else if(msg.attachments?.first().height && msg.attachments?.first().width){
      const attachment = msg.attachments.map(attachment=>attachment.url)
      message.channel.send({//添付ファイルあり(画像)
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
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
      const attachment = msg.attachments.map(attachment=>attachment?.url)
      message.channel.send({//添付ファイルあり(画像以外)
        embeds:[{
          color: msg.member?.displayHexColor||"WHITE",
          author:{
            name: msg.author.tag,
            icon_url: msg.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
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