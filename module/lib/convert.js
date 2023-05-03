module.exports = async(msg)=>{
  require("dotenv").config();
  const fetch = require("node-fetch");

  let reply = {
    "isReply": false
  };
  let attachment = {
    "isAttachments": false
  };

  if(msg.message.reference?.message_id){
    const ugc = await fetch(`https://ugc.renorari.net/api/v2/messages/${msg.message.reference.message_id}`,{
      "method": "GET",
      "headers": {
        "Authorization": `Bearer ${process.env.UGC_KEY}`
      }
    }).then(res=>res.json());

    if(!ugc.data?.message){
      reply = {
        "isReply": true,
        "user":{
          "tag": "UGC#0000",
          "id": "000000000000000000"
        },
        "content": "None"
      };
    }else{
      reply = {
        "isReply": true,
        "user":{
          "tag": `${ugc.data.author.username}#${ugc.data.author.discriminator}`,
          "id": ugc.data.author.id
        },
        "content": ugc.data.message.content
      };
    }
  }

  if(msg.message.attachments.length !== 0){
    attachment = {
      "isAttachments": true,
      "attachment": msg.message.attachments.map((att)=>{
        if(att.height && att.width){
          return {
            "isFile": false,
            "name": att.name,
            "url": att.url
          }
        }else{
          return {
            "isFile": true,
            "name": att.name,
            "url": att.url
          }
        }
      })
    };
  }

  const message = 
    {
      "channel": {
        "name": msg.channel.name,
        "id": msg.channel.id
      },
      "author": {
        "tag":`${msg.author.username}#${msg.author.discriminator}`,
        "id": msg.author.id,
        "avatarURL": msg.author.avatarURL||"https://cdn.discordapp.com/embed/avatars/0.png",
        "bot": msg.author.bot
      },
      "guild": {
        "name": msg.guild.name,
        "id": msg.guild.id,
        "iconURL": msg.guild.iconURL||"https://cdn.discordapp.com/embed/avatars/0.png"
      },
      "content": msg.message.content,
      "id": msg.message.id,
      "clean_content": msg.message.clean_content,
      "reply": reply,
      "attachments": attachment
    }

  return message
}