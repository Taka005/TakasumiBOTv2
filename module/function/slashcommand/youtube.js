module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "youtube"){
    const id = interaction.options.getString("id");

    try{
      const data = await fetch("https://www.youtube.com/youtubei/v1/player",{
        "method": "POST",
        "headers":{
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({  
          "context":{
            "client":{
              "clientName": "WEB",
              "clientVersion": "2.20210721.00.00",
            }
          },
          "videoId": id.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/)
        })
      }).then(res=>res.json());
      console.log(id.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/))

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: data.videoDetails.title,
          url: `https://www.youtube.com/watch?v=${id}`,
          description: data.videoDetails.shortDescription,
          image:{
            url: data.videoDetails.thumbnail.thumbnails[0].url
          },
          fields:[
            {
              name: "ID",
              value: data.videoDetails.videoId,
              inline: true
            },
            {
              name: "チャンネル",
              value: `${data.videoDetails.author}(${data.videoDetails.channelId})`,
              inline: true
            },
            {
              name: "再生数",
              value: `${data.videoDetails.viewCount}回`,
              inline: true
            },
            {
              name: "動画時間",
              value: `${data.videoDetails.lengthSeconds}秒`,
              inline: true
            },
            {
              name: "動画ファイル",
              value: data.streamingData.formats.map(format=>`[${format.fps}FPS ${format.qualityLabel}](${format.url})`).join("\n")
            }
          ],
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "有効なYoutubeの動画IDを指定してください"+error
        }],
        ephemeral: true
      });
    }
  }
}