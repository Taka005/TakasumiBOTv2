module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "nslookup"){
    const name = interaction.options.getString("name");

    try{
      const data = await fetch(`https://dns.google/resolve?name=${name}`)
        .then(res=>res.json());

      if(!data.Answer) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "違うアドレスで試してください"
        }],
        ephemeral: true
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${name}の結果`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `\`${data.Answer.map(address=>address.data).join("\n")}\``,
          footer:{
            text: "TakasumiBOT"
          }
        }]
      })
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "違うアドレスを試してください"
        }],
        ephemeral: true
      });
    }
  }
}