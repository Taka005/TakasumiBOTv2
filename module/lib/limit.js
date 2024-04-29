const Spam = require("./spam");
const spam1 = new Spam(600);
const spam2 = new Spam(600);
const last = new Spam(180000);

module.exports = (message)=>{
  const { Colors } = require("discord.js");

  if(last.check(message.guild.id)) return true;

  if(spam1.count(message.guild.id)){
    if(spam2.count(message.guild.id)){
      message.channel.send({
        embeds:[{
          color: Colors.Yellow,
          author:{
            name: "レートリミット",
            icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
          },
          description: "メッセージを送信する速度が早すぎます\n3分間はメッセージを応答しなくなります",
          timestamp: new Date()
        }]
      }).catch(()=>{});

      last.count(message.guild.id);

      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}