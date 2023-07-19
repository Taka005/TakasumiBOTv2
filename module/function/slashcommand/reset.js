module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "reset"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```管理者```"
          }
        ]
      }],
      ephemeral: true
    });
   
    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの管理\nチャンネルの閲覧\nメッセージの送信```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      await interaction.update({});

      const channel = await interaction.channel.clone();
      await channel.setPosition(interaction.channel.position+1)
      await interaction.channel.delete()

      await channel.send({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.user.tag}がチャンネルがリセットしました`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          }
        }]
      }).catch(()=>{});
      
    }catch(error){
      await interaction.reply({ 
        embeds:[{
          color: Colors.Red,
          author:{
            name: "チャンネルをリセットできませんでした",
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
      });
    }
  }
}