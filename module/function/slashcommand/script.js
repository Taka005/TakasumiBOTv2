module.exports = async(interaction)=>{
  const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "script"){
    const lang = interaction.options.getString("lang");

    const modal = new Modal()
      .setCustomId(`script_${lang}`)
      .setTitle("コードを実行");

    const code = new TextInputComponent()
      .setCustomId("code")
      .setLabel(`${lang}を実行`)
      .setPlaceholder("実行するコードを入力")
      .setMaxLength(500)
      .setRequired(true)
      .setStyle("PARAGRAPH");
      
    modal.addComponents(new MessageActionRow().addComponents(code));
  
    await interaction.showModal(modal);
  }
}