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
          icon_url: "https://cdn.taka.cf/images/system/error.png"
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

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageRoles)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理\nメッセージの送信\nチャンネルの閲覧```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!role.editable) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "指定したロールがBOTより上か、管理されているロールです"
      }],
      ephemeral: true
    });

    const guide = new ModalBuilder()
      .setCustomId(`guideline_${role.id}`)
      .setTitle("ガイドラインの作成");

    const text = new TextInputBuilder()
      .setCustomId("text")
      .setLabel("テンプレートを編集してガイドラインを作成してください")
      .setMaxLength(3000)
      .setRequired(true)
      .setValue("` 1 ` **１つ目のガイドライン**\n\n` 2 ` **２つ目のガイドライン**\n\n` 3 ` **３つ目のガイドライン**\n\n` 4 ` **４つ目のガイドライン**\n")
      .setStyle(TextInputStyle.Paragraph);
      
    guide.addComponents(new ActionRowBuilder().addComponents(text));
  
    await interaction.showModal(guide);
  }
}