module.exports = async(interaction)=>{
  const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "guideline"){ 
    const role =  interaction.options.getRole("role");

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    const guide = new ModalBuilder()
      .setCustomId(`guideline_${role.id}`)
      .setTitle("ガイドライン作成");

    const temp = new TextInputBuilder()
      .setCustomId("temp")
      .setLabel("テンプレートを編集してガイドラインを作成してください")
      .setMaxLength(3000)
      .setRequired(true)
      .setValue("` 1 ` **１つ目のガイドライン**\n\n` 2 ` **２つ目のガイドライン**\n\n` 3 ` **３つ目のガイドライン**\n\n` 4 ` **４つ目のガイドライン**\n")
      .setStyle(TextInputStyle.Paragraph);
      
    guide.addComponents(new ActionRowBuilder().addComponents(temp));
  
    await interaction.showModal(guide);
  }
}