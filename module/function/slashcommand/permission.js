module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const permission = require("../../lib/permission");
  const fetchMember = require("../../lib/fetchMember");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "permission"){
    const user = interaction.options.getUser("user");

    if(!user) return await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${interaction.user.tag}の権限`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        description: `\`${permission(interaction.member.permissions.toArray()).join("`,`")}\``,
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date()
      }]
    }).catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "権限を取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
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
      })
    });

    const member = await fetchMember(interaction.guild,user.id);
    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限を取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定したユーザーがサーバーに存在しません"
      }],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${member.user.tag}の権限`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        description: `\`${permission(member.permissions.toArray()).join("`,`")}\``,
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date()
      }]
    }).catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "権限を取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
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
      })
    });
  }
}