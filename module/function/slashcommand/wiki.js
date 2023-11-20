module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "wiki"){
    const word = interaction.options.getString("word");

    try{
      const data = await fetch(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`)
        .then(res=>res.json());

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: data.title,
          url: data.content_urls.desktop.page,
          description: data.extract,
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
          description: "検索ワードを変えて、もう一度実行してください"
        }],
        ephemeral: true
      });
    }
  }
}