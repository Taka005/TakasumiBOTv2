module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("guide_")){
    const data = interaction.customId.split("_");

    if(interaction.member.roles.cache.has(data[1])) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "既に同意済みです",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このサーバーのガイドラインに既に同意しているようです"
      }],
      ephemeral: true
    });

    try{
      await interaction.member.roles.add(data[1]);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "同意しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: "このサーバーのガイドラインに同意しました\nこれでロールが付与され、晴れてサーバーの一員となりました"
        }],
        ephemeral: true
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "同意に失敗しました",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}