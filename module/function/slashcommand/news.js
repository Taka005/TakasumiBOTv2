module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  require("dotenv").config();
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "news"){
    
    const data = await fetch(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_KEY}`)
      .then(res=>res.json());
    
    try{
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: data.articles[0].title,
          url: data.articles[0].url,
          description: data.articles[0].description,
          image:{
            url: data.articles[0].urlToImage
          },
          footer:{
            text: `${data.articles[0].publishedAt} | ${data.articles[0].source.name}`
          },
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId("news_0"))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("1ページ")
                .setCustomId("news")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId("news_1"))
        ]
      })
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "もう一度やり直してください"
        }]
      })
    }
  }
}