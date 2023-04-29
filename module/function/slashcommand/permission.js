module.exports = async(interaction)=>{
  const permission = require("../../lib/permission");
  const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "permission"){
    const user = interaction.options.getUser("user");

    if(!user){
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${interaction.user.tag}の権限`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          description: `\`${permission(interaction.member.permissions.toArray()).join("`,`")}\``
        }]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "権限を取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
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
      });
      return;
    }

    try{
      const member = await interaction.guild.members.cache.get(user.id);
      
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${member.user.tag}の権限`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          description: `\`${permission(member.permissions.toArray()).join("`,`")}\``
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          author:{
            name: "権限を取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "ユーザーが存在しないか、時間を置いてから実行してくださ"
        }],
        ephemeral: true
      });
    }
  }
}