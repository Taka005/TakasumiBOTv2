module.exports = async(interaction)=>{
  const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "embed"){

    if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return await interaction.reply({
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

    const embed = new Modal()
      .setCustomId("embed")
      .setTitle("埋め込み作成");

    const title = new TextInputComponent()
      .setCustomId("title")
      .setLabel("タイトル")
      .setPlaceholder("埋め込みに表示されるタイトル")
      .setMaxLength(200)
      .setStyle("SHORT");

    const description = new TextInputComponent()
      .setCustomId("description")
      .setLabel("説明")
      .setMaxLength(3000)
      .setPlaceholder("埋め込みに表示される説明欄")
      .setStyle("PARAGRAPH");
      
    const image = new TextInputComponent()
      .setCustomId("image")
      .setLabel("画像")
      .setPlaceholder("埋め込みに表示される画像のURL")
      .setMaxLength(120)
      .setStyle("SHORT");
      
    embed.addComponents(
      new MessageActionRow()
        .addComponents(title),
      new MessageActionRow()
        .addComponents(description),
      new MessageActionRow()
        .addComponents(image)
    );
    
    await interaction.showModal(embed);
  }
}