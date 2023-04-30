module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "wiki"){
    const word = interaction.options.getString("word");

    const data = await fetch(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`)
      .then(res=>res.json())

    try{
      await interaction.reply({
        embeds:[{
          title: data.title,
          url: data.content_urls.desktop.page,
          color: Colors.Green,
          description: data.extract,
          footer:{
            text: "TakasumiBOT"
          }
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          author:{
            name: "検索内容を取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "検索ワードを変えて、もう一度実行してください"
        }],
        ephemeral: true
      });
    }
  }
}