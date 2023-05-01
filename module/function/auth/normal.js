module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("normal_")){
    const role = interaction.customId.split("_");

    if(interaction.member.roles.cache.has(role[1])) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "既に認証済みです",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        }
      }],
      ephemeral: true
    });

    await interaction.member.roles.add(role[1])
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "認証しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            }
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "認証に失敗しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
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
                  .setStyle("LINK"))
          ],
          ephemeral: true
        })
      })
  }
}