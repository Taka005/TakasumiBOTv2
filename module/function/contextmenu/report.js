module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "Report Message"){
    const message = interaction.options.getMessage("message");
      
    if(!message.content) return await interaction.reply({
      embeds:[{
        author:{
          name: "報告できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    await interaction.client.channels.cache.get(config.report).send({
      embeds: [{
        color: Colors.Green,
        author:{
          name: "メッセージレポート",
          icon_url: "https://cdn.taka.ml/images/system/success.png",
        },
        description: `**${message.author.tag}(${message.author.id})**\n${message.content}`,
        footer:{
          text: `${interaction.user.tag}(${interaction.user.id})`,
          icon_url: interaction.user.avatarURL()||interaction.user.defaultAvatarURL,
        },
        timestamp: new Date()
      }]
    })
      .then(async()=>{
        await interaction.reply({ 
          embeds:[{
            color: Colors.Green,
            author:{
              name: "メッセージを報告しました",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            description: `**${message.author.tag}(${message.author.id})**\n${message.content}`
          }],
          components:[
            new ActionRowBuilder()
              .addComponents( 
                new ButtonBuilder()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
          ]
        });
      })
      .catch(async()=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "メッセージを報告出来ませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            }
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