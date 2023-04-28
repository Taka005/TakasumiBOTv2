module.exports = async(interaction)=>{
  const permission = require("../../lib/permission");
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isContextMenu()) return;
  if(interaction.commandName === "権限を表示"){
    const member = interaction.options.getMember("user");

    if(!member) return await interaction.reply({
      embeds:[{
        author:{
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "指定したユーザーが存在していないか、サーバーから退出しています"
      }],
      ephemeral: true
    });

    try{
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${member.user.tag}の権限`,
            url: `https://discord.com/users/${member.user.id}`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          description: `\`${permission(member.permissions.toArray()).join("`,`")}\``
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "権限を表示できませんでした",
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
          new MessageActionRow()
            .addComponents( 
              new MessageButton()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle("LINK"))
        ],
        ephemeral: true
      });
    }
  }
}