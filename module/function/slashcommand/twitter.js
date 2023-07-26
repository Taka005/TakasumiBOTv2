module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "twitter"){
    const word = interaction.options.getString("word");

    await interaction.deferReply();
    try{
      const data = await fetch(`https://search.yahoo.co.jp/realtime/api/v1/pagination?p=${word}`)
        .then(res=>res.json());

      if(!data.timeline.entry[0]) return await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "検索結果が存在しませんでした"
        }]
      });

      data.timeline.entry.length = 5;

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${word}の検索結果`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: data.timeline.entry.map(data=>`[${data.name}(@${data.screenName})](${data.url})\n${data.displayText}`).join("\n"),
          footer:{
            text: "TakasumiBOT"
          }
        }]
      })
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "検索ワードを変えて、もう一度実行してください"
        }]
      });
    }
  }
}