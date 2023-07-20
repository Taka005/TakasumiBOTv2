const time = {};
module.exports = (message)=>{
  const { Colors } = require("discord.js");
  if(!time[message.guild.id]){
    time[message.guild.id] = {
      time1: 0,
      time2: 0,
      last: 0
    };
  }

  if(new Date() - time[message.guild.id].last <= 180000) return true;

  if(new Date() - time[message.guild.id].time1 <= 600){
    if(new Date() - time[message.guild.id].time2 <= 600){
      message.channel.send({
        embeds:[{
          author:{
            name: "レートリミット",
            icon_url: "https://cdn.taka.cf/images/system/warn.png"
          },
          description: "メッセージを送信する速度が早すぎます\n3分間はメッセージを応答しなくなります",
          timestamp: new Date(),
          color: Colors.Yellow
        }]
      }).catch(()=>{});
      time[message.guild.id].last = new Date();
      return true;
    }else{
      time[message.guild.id].time1 = new Date();
      time[message.guild.id].time2 = new Date();
      return false;
    }
  }else{
    time[message.guild.id].time1 = new Date();
    return false;
  }
}