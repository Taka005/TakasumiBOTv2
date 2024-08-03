module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  const random = require("../../lib/random");
  const words = require("../../../file/words");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "word"){

    const target = random(words);
    const type = Math.random() > 0.5 ? "en" : "ja";

    const word = new ModalBuilder()
      .setCustomId(`word_${type}_${target.index}`)
      .setTitle("英単語ゲーム");

    const text = new TextInputBuilder()
      .setCustomId("text")
      .setLabel(`${target[type]}を${type === "en" ? "英語" : "日本語"}に直せ`)
      .setMaxLength(30)
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    word.addComponents(new ActionRowBuilder().addComponents(text));

    await interaction.showModal(word);
  }
}