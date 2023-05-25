const spam = require("../../lib/spam");
const Spam = new spam(5000);

module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isStringSelectMenu()) return;
  if(interaction.customId === "role"){
    
    if(Spam.count(interaction.guild.id)) return await interaction.reply({
      embeds:[{
        author:{
          name: "ロールの付与に失敗しました",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "ロールの付与速度が速すぎるため5秒間待ってください"
      }],
      ephemeral: true
    });

    await interaction.deferReply({ephemeral: true});
    try{
      const add = interaction.values.filter(role=>!interaction.member.roles.cache.has(role))
      const remove = interaction.values.filter(role=>!add.includes(role));

      add.forEach(role=>{
        interaction.member.roles.add(role)
          .catch(()=>{})
      });

      remove.forEach(role=>{
        interaction.member.roles.remove(role)
          .catch(()=>{})
      });

      await interaction.editReply({
        embeds:[{
          author:{
            name: "ロールを変更しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          color: Colors.Green,
          fields:[
            {
              name: "付与したロール",
              value: add.map(role=>`<@&${role}>`).join("\n")||"なし"
            },     
            {
              name: "削除したロール",
              value: remove.map(role=>`<@&${role}>`).join("\n")||"なし"
            }
          ]
        }],
        ephemeral: true
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          author:{
            name: "ロールの変更に失敗しました",
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
    }
  }
}