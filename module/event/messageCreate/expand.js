module.exports = async(message)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  const limit = require("../../lib/limit");
  const ignore = require("../../lib/ignore");
  const fetchGuild = require("../../lib/fetchGuild");
  const fetchChannel = require("../../lib/fetchChannel");
  const fetchMessage = require("../../lib/fetchMessage");

  if(
    message.author.bot||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.ViewChannel)||
    !message.guild.members.me.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)
  ) return;

  const link = message.content.match(/https?:\/\/(?:ptb\.|canary\.)?(?:discord|discordapp)\.com\/channels\/\d{17,19}\/\d{17,19}\/\d{17,19}(?=\s|$)/);
  if(link){
    if(await ignore.check(message.guild.id,"expand")||limit(message)) return;

    const guild = await fetchGuild(message.client,link[1]);
    if(!guild) return;

    const channel = await fetchChannel(guild,link[2]);
    if(!channel) return;

    const msg = await fetchMessage(channel,link[3]);
    if(!msg) return;

    const embed = [{
      color: Colors.Green,
      author:{
        name: msg.author.tag,
        icon_url: msg.author.avatarURL()||msg.author.defaultAvatarURL,
      },
      description: msg.content||"",
      footer:{
        text: `${guild.name} #${msg.channel.name}`,
        icon_url: guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
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