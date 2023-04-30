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
          author:{
            name: "DNS情報が取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "違うアドレスで試してください"
        }],
        ephemeral: true
      });

      await interaction.reply({
        embeds:[{
          author:{
            name: `${name}の結果`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green,
          description: `\`${data.Answer.map(address=>address.data).join("\n")}\``,
          footer:{
            text: "TakasumiBOT"
          }
        }]
      })
    }catch{
      await interaction.reply({
        embeds:[{
          author:{
            name: "DNS情報が取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "違うアドレスを試してください"
        }],
        ephemeral: true
      });
    }
  }
}