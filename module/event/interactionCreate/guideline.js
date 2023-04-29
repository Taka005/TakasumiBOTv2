module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("guideline_")){
    const role = interaction.customId.split("_");
    const temp = interaction.fields.getTextInputValue("temp");

    await interaction.channel.send({
      embeds:[
        {
          color: "GREEN",
          title: "このサーバーのガイドライン",
          description: temp,
          thumbnail:{
            url: "https://cdn.taka.ml/images/system/guideline.png"
          }
        },
        {
          color: "GREEN",
          description: "続行するにはこのサーバーのガイドラインを守る必要があります。\n[Discord コミュニティガイドライン](https://discord.com/guidelines) も忘れないようにして下さい。"
        }
      ],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`guide_${role[1]}`)
              .setStyle("SECONDARY")
              .setLabel("同意します")
          )
      ]
    })
    .then(async()=>{
      await interaction.deferUpdate({});
    })
    .catch(async(error)=>{
      await interaction.reply({ 
        embeds:[{
          author:{
            name: "ガイドライン機能の作成に失敗しました",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "BOTの権限等を確認し、もう一度実行してください",
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
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