module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const fetchMessage = require("../../lib/fetchMessage");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("enquetesend_")){
    const id = interaction.customId.split("_")[1];
    const text = interaction.fields.getTextInputValue("text");

    const message = await fetchMessage(interaction.channel,id);
    if(!message) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "回答を追加出来ませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "Botの権限を確認してやり直してください"
      }],
      ephemeral: true
    });

    if(!message.embeds[0]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "回答を追加出来ませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "埋め込みが存在しません"
      }],
      ephemeral: true
    });

    await message.edit({
      embeds:[{
        color: Colors.Green,
        title: message.embeds[0].title,
        description: `${message.embeds[0].description||""}\n▷${text} - ${interaction.user.tag}`,
        timestamp: new Date()
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("回答する")
              .setCustomId("enquete")
              .setStyle(ButtonStyle.Secondary))
      ]
    })
      .then(async()=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "回答しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "回答出来ませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "BOTの権限が不足しています",
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