module.exports = async(message)=>{
  const fetch = require("node-fetch");
  const { WebhookClient } = require("discord.js");
  require("dotenv").config();
  const db = require("../../../lib/db");
  const fetchMessage = require("../../../lib/fetchMessage");
  const fetchWebhookMessage = require("../../../lib/fetchWebhookMessage");

  let reference = {
    "channel_id": message.reference.channelId || null,
    "guild_id": message.reference.guildId || null,
    "message_id": message.reference.messageId || null
  };

  if(reference.message_id&&reference.channel_id){
    const replyMessage = await fetchMessage(message.channel,reference.message_id);
    if(replyMessage){
      reference["message_id"] = replyMessage.id;
    }else{
      const global = await db(`SELECT * FROM global WHERE channel = ${reference.channel_id} LIMIT 1;`);

      const replyWebhook = new WebhookClient({id: global[0].id, token: global[0].token});
      const replyWebhookMessage = await fetchWebhookMessage(replyWebhook,reference.message_id);
      if(replyWebhookMessage){
        reference["message_id"] = replyWebhookMessage.embeds[0].image.url.match(/\d{18,19}/g)[0];
      }else{
        reference["message_id"] = null;
      }
    }
  }

  const content = message.content
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[招待リンク]")
  
  const cleanContent = message.cleanContent
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[招待リンク]")

  await fetch("https://ugc.renorari.net/api/v2/messages",{
    "method": "POST",
    "headers":{
      "Authorization": `Bearer ${process.env.UGC_KEY}`,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(
      {
        "channel":{
          "name": message.channel.name,
          "id": message.channel.id
        },
        "author":{
          "username": message.author.username,
          "discriminator": message.author.discriminator,
          "id": message.author.id,
          "avatarURL": message.author.avatarURL({"dynamic":true,"extension":"png","size": 512}),
          "bot": message.author.bot
        },
        "guild":{
          "name": message.guild.name,
          "id": message.guild.id,
          "iconURL": message.guild.iconURL({"dynamic":true,"extension":"png","size":256})
        },
        "message":{
          "content": content,
          "id": message.id,
          "clean_content": cleanContent,
          "reference": reference,
          "attachments": message.attachments.map((attachment)=>({
            "name": attachment.name,
            "url": attachment.url,
            "height": attachment.height,
            "width": attachment.width,
            "content_type": attachment.contentType
          })),
          "embeds": message.embeds
        }
      }
    )
  });
}