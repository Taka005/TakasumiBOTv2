module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("panel_")){
    const role = interaction.customId.split("_")[1];

    await interaction.message.edit({
      embeds:[{
        color: Colors.blue,
        description: `<@&${role}>を貰うには、認証ボタンを押してください`
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`math_${role}`)
              .setStyle(ButtonStyle.Primary)
              .setLabel("認証"))
        ]
    })
    .then(async()=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "もう一度認証してください",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "この認証は古いバージョンを使用しているため更新しました\n再度ボタンを押すことで認証できます"
        }],
        ephemeral: true
      });
    })
    .catch(async()=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "もう一度認証してください",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "この認証は古いバージョンを使用しているため認証できません\n`/auth`を使用して作り直してください"
        }],
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle("LINK"))
        ],
        ephemeral: true
      });
    })
  }
}