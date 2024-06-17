const Spam = require("../../lib/spam");
const spam = new Spam(300000,true);

module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "report"){

    if(spam.count(interaction.user.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "通報できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "連続して通報することはできません\nしばらく待ってください"
      }],
      ephemeral: true
    });

    const report = new ModalBuilder()
      .setCustomId("report")
      .setTitle("通報");

    const id = new TextInputBuilder()
      .setCustomId("id")
      .setLabel("対象のユーザーID又はサーバーID")
      .setMaxLength(20)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const reason = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("理由(なるべく詳しく書いてください)")
      .setMaxLength(800)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    report.addComponents(
      new ActionRowBuilder()
        .addComponents(id),
      new ActionRowBuilder()
        .addComponents(reason)
    );

    await interaction.showModal(report);
  }
}