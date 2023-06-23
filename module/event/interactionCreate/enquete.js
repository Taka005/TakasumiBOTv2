module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId === "enquete"){

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