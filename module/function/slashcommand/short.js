module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  const isUrl = require("../../lib/isUrl");
  require("dotenv").config();
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "short"){
    const url = interaction.options.getString("url");

    if(!isUrl(url)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "短縮URLにできませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "URLを指定する必要があります"
      }],
      ephemeral: true
    });

    const data = await fetch(`https://is.gd/create.php?extension=simple&url=${encodeURI(url)}`)
      .then(res=>res.text());
      
    await interaction.reply(data);
  }
}