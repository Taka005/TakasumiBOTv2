module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  const { JSDOM } = require("jsdom");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "yahoo"){
    const word = interaction.options.getString("word");

    await interaction.deferReply();
    try{
      const res = await fetch(`https://search.yahoo.co.jp/search?p=${word}`)
        .then(res=>res.text());

      const { document } = (new JSDOM(res)).window;

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          title: `${word}の検索結果`,
          url: `https://search.yahoo.co.jp/search?p=${word}`,
          description: Array.from(document.querySelectorAll("li a")).map(data=>`[${data.innerHTML.replace(/<[^>]+>/g,"")}](${data.href})`).join("\n"),
          footer:{
            text: "TakasumiBOT"
          }
        }]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "検索ワードを変えてやり直してください"
        }]
      });
    }
  }
}