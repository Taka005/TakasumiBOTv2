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
    const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${message.guild.id};`);
    if(ignore[0]||limit(message)) return;

    const channel = await fetchChannel(message.guild,link[2]);
    const msg = await fetchMessage(channel,link[3]);
    if(!channel||!msg) return;

    const embed = [{
      color: Colors.Green,
      author:{
        name: msg.author.tag,
        icon_url: msg.author.avatarURL()||msg.author.defaultAvatarURL,
      },
      description: msg.content||"",
      footer:{
        text: `#${msg.channel.name}`
      },
      timestamp: msg.createdAt
    }];

    if(msg.embeds[0]){
      embed.push(msg.embeds[0]);
    }

    const attachment = msg.attachments.first();
    if(attachment){
      if(attachment.height&&attachment.width){
        embed[0].image = {
          url: attachment.url
        };
      }else{
        embed[0].fields = [
          {
            name: "添付ファイル",
            value: `[${attachment.name}](${attachment.url})`
          }
        ];
      }
    }

    await message.channel.send({
      embeds: embed
    }).catch(()=>{});
  }
}