module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "pypi"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const pkg = await fetch(`https://pypi.org/pypi/${name}/json`)
        .then(res=>res.json())

      await interaction.editReply({
        embeds:[{
          title: pkg.info.name,
          url: pkg.info.package_url,
          color: "GREEN",
          description: pkg.info.summary,
          thumbnail:{
            url: "https://cdn.taka.ml/images/pypi.png",
          },
          fields:[
            {
              name: "作者",
              value: pkg.info.author ? pkg.info.author : "なし",
              inline: true
            },
            {
              name: "バージョン",
              value: pkg.info.version,
              inline: true
            },
            {
              name: "リポジトリ",
              value: pkg.info.project_urls.Home ? pkg.info.project_urls.Home : "なし",
              inline: true
            },
            {
              name: "ライセンス",
              value: pkg.info.license ? pkg.info.license : "なし",
              inline: true
            },
            {
              name: "キーワード",
              value: pkg.info.keywords ? pkg.info.keywords : "なし",
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