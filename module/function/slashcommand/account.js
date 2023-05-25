module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "account"){
    const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id} LIMIT 1;`);

    if(!account[0]) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: Lang.get("command.account.NoRegister"),
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: Lang.get("command.account.NoRegisterDescription")
      }], 
      components:[
        new ActionRowBuilder()
          .addComponents( 
            new ButtonBuilder()
              .setLabel(Lang.get("command.account.GoSite"))
              .setURL("https://auth.taka.ml/")
              .setStyle(ButtonStyle.Link))
      ],
      ephemeral: true
    });

    await interaction.reply({ 
      embeds:[{
        color: Colors.Green,
        author:{
          name: Lang.get("command.account.RegisterInfo"),
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        description: `ID\n\`${account[0].id}\`\nIPアドレス\n\`${account[0].ip}\`\n登録日時/更新日時\n\`${new Date(account[0].time).toLocaleString()}\``
      }],
      ephemeral: true
    });
  }
}