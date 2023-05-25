module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("guide_")){
    const role = interaction.customId.split("_");
    
    if(interaction.member.roles.cache.has(role[1])) return await interaction.reply({
      embeds:[{
        author:{
          name: "既に同意済みです",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このサーバーのガイドラインに既に同意しているようです"
      }],
      ephemeral: true
    });

    await interaction.member.roles.add(role[1])
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "同意しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            description: "このサーバーのガイドラインに同意しました\nこれでロールが付与され、晴れてサーバーの一員となりました",
            color: Colors.Green
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "同意に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: "BOTの権限が不足しているか、付与するロールがBOTより上の可能性があります",
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