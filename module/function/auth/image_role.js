module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
  if(!interaction.isSelectMenu()) return;
  if(interaction.customId.startsWith("imagerole_")){
    const list = interaction.customId.split("_");
    const key = interaction.values[0];

    if(interaction.member.roles.cache.has(list[1])) return await interaction.reply({
      embeds:[{
        author:{
          name: "既に認証済みです",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
      }],
      ephemeral: true
    });

    if(key === list[2]){
      await interaction.member.roles.add(list[1])
        .then(async()=>{
          await interaction.reply({
            embeds:[{
              author:{
                name: "認証しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }],
            ephemeral: true
          });
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              author:{
                name: "認証に失敗しました",
                icon_url: "https://cdn.taka.ml/images/system/error.png"
              },
              color: "RED",
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
          });
        })
    }else{
      await interaction.reply({
        embeds:[{
          author:{
            name: "選択した値が間違っています",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "画像に表示される文字を選択してください"
        }],
        ephemeral: true
      });
    }
  }
}