module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId === "register"){
    const text = interaction.fields.getTextInputValue("text")
      .replace(/\\n/g,"");

    await interaction.channel.createInvite({
      "unique": true,
      "maxAge": 0
    })
      .then(async(invite)=>{
        await db(`INSERT INTO server (id, owner, code, text, time) VALUES("${interaction.guild.id}","${interaction.guild.ownerId}","${invite.code}","${text}",NOW());`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "登録しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: "サーバー掲示板に公開されます"
          }]
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "登録できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
      });
  }
}