module.exports = async(guild,client)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  let find = 0;
  guild.channels.cache.map((channel)=>{
    if(find === 0){
      if(
        channel.type === "GUILD_TEXT"&&
        guild.members.me.permissionsIn(channel).has("VIEW_CHANNEL")&&
        guild.members.me.permissionsIn(channel).has("SEND_MESSAGES")
      ){
        channel.send({
          embeds:[{
            color: "GREEN",
            thumbnail:{
              url: "https://cdn.taka.ml/images/bot.png"
            },
            title: "BOT導入ありがとうございます!",
            description: "やっほー。TakasumiBOTだよ\n便利な機能を備えた万能BOTです\n\nグローバルチャット、役職パネル、認証機能などいろいろあるよ!\nコマンドのhelpを表示する時は`/help`を実行してね\n`/follow`を実行するとBOTのアナウンスチャンネルが追加できます",
            footer:{
              text: `導入数:${client.guilds.cache.size}サーバー`
            },
            timestamp: new Date()
          }],
          components:[
            new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle("LINK"))
          ]
        });
        return find = 1;
      }
    }
  });
}