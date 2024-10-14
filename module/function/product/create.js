module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.options.getSubcommand() === "create"){

    const create = new ModalBuilder()
      .setCustomId("create")
      .setTitle("商品の作成");

    const name = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("商品名")
      .setPlaceholder("商品を名前")
      .setMaxLength(20)
      .setStyle(TextInputStyle.Short);

    const price = new TextInputBuilder()
      .setCustomId("price")
      .setLabel("値段")
      .setPlaceholder("所持金以下の金額しか指定できません")
      .setMaxLength(10)
      .setMinLength(2)
      .setStyle(TextInputStyle.Short);

    const content = new TextInputBuilder()
      .setCustomId("content")
      .setLabel("内容")
      .setPlaceholder("商品にする内容(金銭に関わるリンクは貼らないでください)")
      .setMaxLength(300)
      .setStyle(TextInputStyle.Paragraph);

    create.addComponents(
      new ActionRowBuilder()
        .addComponents(name),
      new ActionRowBuilder()
        .addComponents(price),
      new ActionRowBuilder()
        .addComponents(content)
    );

    await interaction.showModal(create);
  }
}