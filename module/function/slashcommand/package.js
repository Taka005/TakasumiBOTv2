module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "package"){
    const type = interaction.options.getString("type");
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      if(type === "npm"){
        const res = await fetch(`https://api.npms.io/v2/search?q=${name}`)
          .then(res=>res.json());

        const pkg = res.results[0].package;
        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            title: `NPM: ${pkg.name}`,
            url: pkg.links.npm,
            description: pkg.description,
            thumbnail:{
              url: "https://cdn.takasumibot.com/images/npm.png",
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
        });
      }else if(type === "pypi"){
        const pkg = await fetch(`https://pypi.org/pypi/${name}/json`)
          .then(res=>res.json());

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            title: `PYPI: ${pkg.info.name}`,
            url: pkg.info.package_url,
            description: pkg.info.summary,
            thumbnail:{
              url: "https://cdn.takasumibot.com/images/pypi.png",
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
        });
      }
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "検索ワードを変えてやり直してください"
        }]
      });
    }
  }
}