module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("guideline_")){
    const data = interaction.customId.split("_");
    const text = interaction.fields.getTextInputValue("text");

    try{
      await interaction.channel.send({
        embeds:[{
          color: Colors.Green,
          title: "このサーバーのガイドライン",
          thumbnail:{
            url: "https://cdn.takasumibot.com/images/system/guideline.png"
          },
          description: text
        },
        {
          color: Colors.Green,
          description: "続行するにはこのサーバーのガイドラインを守る必要があります。\n[Discord コミュニティガイドライン](https://discord.com/guidelines) も忘れないようにして下さい。"
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`guide_${data[1]}`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel("同意します"))
        ]
      });

      await interaction.deferUpdate({});
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ガイドラインの作成に失敗しました",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
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
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}