module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { MessageButton, MessageActionRow } = require("discord.js");
  require("dotenv").config();
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("news_")){
    const pages = interaction.customId.split("_");

    const data = await fetch(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${process.env.NEWS_KEY}`)
      .then(res=>res.json())
  
    const before = new MessageButton()
      .setStyle("PRIMARY")
      .setLabel("前")
      .setCustomId(`news_${Number(pages[1])-1}`)
  
    const next = new MessageButton()
      .setStyle("PRIMARY")
      .setLabel("次")
      .setCustomId(`news_${Number(pages[1])+1}`)
  
    const page = new MessageButton()
      .setStyle("SECONDARY")
      .setLabel(`${Number(pages[1])+1}ページ`)
      .setCustomId("news")
      .setDisabled(true)
  
    try{
      await interaction.message.edit({
        embeds:[{
          title: data.articles[pages[1]].title,
          url: data.articles[pages[1]].url,
          color: "GREEN",
          description: data.articles[pages[1]].description,
          image:{
            url: data.articles[pages[1]].urlToImage
          },
          footer:{
            text: `${data.articles[pages[1]].publishedAt} | ${data.articles[pages[1]].source.name}`
          }
        }],
        components:[
          new MessageActionRow()
            .addComponents(before)
            .addComponents(page)
            .addComponents(next)
        ]
      })
    }catch{
      await interaction.message.edit({
        embeds:[{
          author:{
            name: "ページが存在しません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "前のページに戻ってください"
        }],
        components:[
          new MessageActionRow()
            .addComponents(before)
            .addComponents(page)
            .addComponents(next)
        ]
      }).catch(()=>{})
      
      await interaction.deferUpdate({});
    }
  }
}