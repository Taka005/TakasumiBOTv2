module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("guideline_")){
    const role = interaction.customId.split("_");
    const temp = interaction.fields.getTextInputValue("temp");

    await interaction.channel.send({
      embeds:[
        {
          color: Colors.Green,
          title: "このサーバーのガイドライン",
          thumbnail:{
            url: "https://cdn.taka.ml/images/system/guideline.png"
          },
          description: temp
        },
        {
          color: Colors.Green,
          description: "続行するにはこのサーバーのガイドラインを守る必要があります。\n[Discord コミュニティガイドライン](https://discord.com/guidelines) も忘れないようにして下さい。"
        }
      ],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`guide_${role[1]}`)
              .setStyle(ButtonStyle.Secondary)
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
            name: "ガイドラインの作成に失敗しました",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
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
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true 
      });
    })
  }
}