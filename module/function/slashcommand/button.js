module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const isUrl = require("../../lib/isUrl");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "button"){
    const name = interaction.options.getString("name");
    const url = interaction.options.getString("url");

    if(!isUrl(url)) return await interaction.reply({
      embeds:[{
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "URLを指定する必要があります"
      }],
      ephemeral: true
    });

    await interaction.reply({
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel(name)
              .setURL(url)
              .setStyle(ButtonStyle.Link))
      ]
    });
  }
}