module.exports = async(member)=>{
  const { WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchChannel = require("../../lib/fetchChannel");
  const config = require("../../../config.json");

  const data = await db(`SELECT * FROM \`leave\` WHERE server = ${member.guild.id};`);
  if(data[0]){
    const msg = data[0].message
      .replace(/\[User\]/g,`<@${member.user.id}>`)
      .replace(/\[UserName\]/g,`${member.user.tag}`)
      .replace(/\[UserDisplayName\]/g,`${member.user.displayName}`)
      .replace(/\[UserID\]/g,`${member.user.id}`)
      .replace(/\[ServerName\]/g,`${member.guild.name}`)
      .replace(/\[ServerID\]/g,`${member.guild.id}`)
      .replace(/\[Count\]/g,`${member.guild.memberCount}`);

    try{
      const webhook = new WebhookClient({id: data[0].id, token: data[0].token});
      await webhook.send({
        content: msg,
        username: "TakasumiBOT Leave",
        avatarURL: "https://cdn.takasumibot.com/images/icon.png"
      });
    }catch(error){
      await db(`DELETE FROM \`leave\` WHERE channel = ${data[0].channel};`);
      const channel = await fetchChannel(member.guild,data[0].channel);
      if(!channel) return;
      await channel.send({
        embeds:[{
          author:{
            name: "退出メッセージでエラーが発生しました",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          color: Colors.Red,
          description: "エラーが発生したため、強制的に無効にされました",
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ]
      }).catch(()=>{});
    }
  }
}