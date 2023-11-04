module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "embed"){

    const embed = new ModalBuilder()
      .setCustomId("embed")
      .setTitle("埋め込み作成");

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("タイトル")
      .setPlaceholder("埋め込みに表示されるタイトル")
      .setMaxLength(200)
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("説明")
      .setPlaceholder("埋め込みに表示される説明欄")
      .setMaxLength(3000)
      .setRequired(false)
      .setStyle(TextInputStyle.Paragraph);

    const image = new TextInputBuilder()
      .setCustomId("image")
      .setLabel("画像")
      .setPlaceholder("埋め込みに表示される画像のURL")
      .setMaxLength(120)
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    embed.addComponents(
      new ActionRowBuilder()
        .addComponents(title),
      new ActionRowBuilder()
        .addComponents(description),
      new ActionRowBuilder()
        .addComponents(image)
    );

    await interaction.showModal(embed);
  }
}