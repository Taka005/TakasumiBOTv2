module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const permission = require("../../lib/permission");
  const fetchMember = require("../../lib/fetchMember");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "permission"){
    const user = interaction.options.getUser("user");

    try{
      if(!user){
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${interaction.user.displayName}の権限`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `\`${permission(interaction.member.permissions.toArray()).join("`,`")}\``,
            footer:{
              text: "TakasumiBOT"
            },
            timestamp: new Date()
          }]
        });
      }else{
        const member = await fetchMember(interaction.guild,user.id);
        if(!member) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "権限を取得できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "指定したユーザーがサーバーに存在しません"
          }],
          ephemeral: true
        });

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${member.user.displayName}の権限`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `\`${permission(member.permissions.toArray()).join("`,`")}\``,
            footer:{
              text: "TakasumiBOT"
            },
            timestamp: new Date()
          }]
        });
      }
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "権限を取得できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
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