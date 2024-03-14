module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const escape = require("../../lib/escape");
  const config = require("../../../config.json");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId === "register"){
    const text = interaction.fields.getTextInputValue("text")
      .replace(/\\n/g,"");

    try{
      const invite = await interaction.channel.createInvite({
        "unique": true,
        "maxAge": 0
      });

      await db(`INSERT INTO server (id, name, count, icon, owner, code, text, time) VALUES("${interaction.guild.id}","${escape(interaction.guild.name)}","${interaction.guild.memberCount}","${interaction.guild.iconURL({extension:"png",size:1024})||"https://cdn.discordapp.com/embed/avatars/0.png"}","${interaction.guild.ownerId}","${invite.code}","${escape(text)}",NOW());`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "登録しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: "サーバー掲示板に公開しました"
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録できませんでした",
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
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}