module.exports = async(interaction,Lang)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "npm"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const res = await fetch(`https://api.npms.io/v2/search?q=${name}`)
        .then(res=>res.json());

      const pkg = res.results[0].package;
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          title: pkg.name,
          url: pkg.links.npm,
          description: pkg.description,
          thumbnail:{
            url: "https://cdn.taka.ml/images/npm.png",
          },
          fields:[
            {
              name: "作者",
              value: pkg.author ? pkg.author.name : "なし",
              inline: true
            },
            {
              name: "バージョン",
              value: pkg.version,
              inline: true
            },
            {
              name: "リポジトリ",
              value: pkg.links.repository ? pkg.links.repository : "なし",
              inline: true
            },
            {
              name: "キーワード",
              value: pkg.keywords ? pkg.keywords.join(", ") : "なし",
              inline: true
            }
          ],
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
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "検索ワードを変えてやり直してください"
        }]
      });
    }
  }
}