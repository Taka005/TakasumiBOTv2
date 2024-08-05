module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "report"){

    const report = new ModalBuilder()
      .setCustomId("report")
      .setTitle("通報");

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("用件")
      .setPlaceholder("通報する用件を簡潔に入力してください")
      .setMaxLength(100)
      .setMinLength(10)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const id = new TextInputBuilder()
      .setCustomId("id")
      .setLabel("対象のID")
      .setPlaceholder("ユーザーID又はサーバーIDを入力してください")
      .setMaxLength(20)
      .setMinLength(15)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const reason = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("理由")
      .setPlaceholder("可能な限り詳しく入力してください")
      .setMaxLength(800)
      .setMinLength(15)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    report.addComponents(
      new ActionRowBuilder()
        .addComponents(title),
      new ActionRowBuilder()
        .addComponents(id),
      new ActionRowBuilder()
        .addComponents(reason)
    );

    await interaction.showModal(report);
  }
}