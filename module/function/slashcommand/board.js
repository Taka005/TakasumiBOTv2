module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "board"){
      
    await interaction.reply({
      content: `<@${interaction.user.id}>`,
      embeds:[{
        color: Colors.Green,
        title: "⭕️❌ゲーム"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_0"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_1"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_2")),
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_3"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_4"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_5")),
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_6"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_7"),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("-")
              .setCustomId("board_8"))
      ]
    });
  }
}