module.exports = async(interaction)=>{
  const { Colors, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  const langs = require("../../../file/langs.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "script"){
    const lang = interaction.options.getString("lang");

    const data = langs.find(la=>la.compiler === lang);
    if(!data) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "実行できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "存在しない言語です"
      }],
      ephemeral: true
    });

    const modal = new ModalBuilder()
      .setCustomId(`script_${data.compiler}`)
      .setTitle("コードを実行");

    const code = new TextInputBuilder()
      .setCustomId("code")
      .setLabel(`${data.name}(${data.compiler})を実行`)
      .setPlaceholder("実行するコードを入力")
      .setMaxLength(800)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(new ActionRowBuilder().addComponents(code));

    await interaction.showModal(modal);
  }
}