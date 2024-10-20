module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "script"){
    const lang = interaction.options.getString("lang");

    const modal = new ModalBuilder()
      .setCustomId(`script_${lang}`)
      .setTitle("コードを実行");

    const code = new TextInputBuilder()
      .setCustomId("code")
      .setLabel(`${lang}を実行`)
      .setPlaceholder("実行するコードを入力")
      .setMaxLength(800)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(new ActionRowBuilder().addComponents(code));

    await interaction.showModal(modal);
  }
}