module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, PermissionFlagsBits } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "embed"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    const embed = new ModalBuilder()
      .setCustomId("embed")
      .setTitle("埋め込み作成");

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("タイトル")
      .setPlaceholder("埋め込みに表示されるタイトル")
      .setMaxLength(200)
      .setStyle("SHORT");

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("説明")
      .setMaxLength(3000)
      .setPlaceholder("埋め込みに表示される説明欄")
      .setStyle("PARAGRAPH");
      
    const image = new TextInputBuilder()
      .setCustomId("image")
      .setLabel("画像")
      .setPlaceholder("埋め込みに表示される画像のURL")
      .setMaxLength(120)
      .setStyle("SHORT");
      
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