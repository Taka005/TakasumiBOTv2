module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "npm"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const res = await fetch(`https://api.npms.io/v2/search?q=${name}`)
        .then(res=>res.json())

      const pkg = res.results[0].package;
      await interaction.editReply({
        embeds:[{
          title: pkg.name,
          url: pkg.links.npm,
          color: "GREEN",
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
              name: "保有者",
              value: pkg.maintainers ? pkg.maintainers.map(e=>e.username).join(", ") : "なし",
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
          author:{
            name: "パッケージが取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "検索ワードを変えて、もう一度実行してください"
        }]
      });
    }
  }
}