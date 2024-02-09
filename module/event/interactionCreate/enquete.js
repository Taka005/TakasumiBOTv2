module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId === "enquete"){

    if(!interaction.message.embeds[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "回答を追加出来ませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "埋め込みが存在しません"
      }],
      ephemeral: true
    });

    const enquete = new ModalBuilder()
      .setCustomId(`enquetesend_${interaction.message.id}`)
      .setTitle(interaction.message.embeds[0].title);

    const text = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("回答")
      .setMaxLength(50)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    enquete.addComponents(new ActionRowBuilder().addComponents(text));

    await interaction.showModal(enquete);
  }
}