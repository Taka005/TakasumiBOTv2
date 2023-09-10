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
          "videoId": id.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/)[1]
        })
      }).then(res=>res.json());

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: data.videoDetails.title,
          url: `https://www.youtube.com/watch?v=${data.videoDetails.videoId}`,
          description: data.videoDetails.shortDescription,
          image:{
            url: data.videoDetails.thumbnail.thumbnails[data.videoDetails.thumbnail.thumbnails.length - 1].url
          },
          fields:[
            {
              name: "チャンネル",
              value: `[${data.videoDetails.author}](${data.microformat.playerMicroformatRenderer.ownerProfileUrl})`
            },
            {
              name: "再生数",
              value: `${data.videoDetails.viewCount}回`
            },
            {
              name: "動画時間",
              value: `${data.videoDetails.lengthSeconds}秒`
            },
            {
              name: "投稿日",
              value: data.microformat.playerMicroformatRenderer.uploadDate
            },
          ],
          footer:{
            text: "TakasumiBOT"
          }
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "有効なYoutubeの動画IDを指定してください"
        }],
        ephemeral: true
      });
    }
  }
}