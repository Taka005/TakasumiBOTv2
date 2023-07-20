module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors, PermissionFlagsBits } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId === "ticket"){

    if(interaction.guild.channels.cache.find(name => name.name === interaction.user.id)) return await interaction.reply({
      embeds:[{
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "既にチケットが作成済みです"
      }],
      ephemeral: true
    });

    const channel = interaction.guild.channels.cache.find(name => name.name === "ticket")
    if(!channel) return await interaction.reply({
      embeds:[{
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "ticketカテゴリーが存在していません"
      }],
      ephemeral: true
    });

    await interaction.guild.channels.create({
      name: interaction.user.id,
      permissionOverwrites:[{
        id: interaction.guild.roles.everyone,
        deny: [PermissionFlagsBits.ViewChannel]
      }],
      parent: channel.id
    })
      .then(async(ch)=>{
        await ch.permissionOverwrites.edit(interaction.user.id,{ViewChannel: true});
        await ch.send({
          content: `<@${interaction.user.id}>`,
          embeds:[{
            color: Colors.Green,
            title: "チケットへようこそ"
          }],
          components:[
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("close")
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("閉じる"))
          ]
        });

        await interaction.reply({
          embeds:[{
            author:{
              name: `チケットを作成しました`,
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `<#${ch.id}>`,
            color: Colors.Green
          }],
          ephemeral: true
        });
      })
      .catch(async(error)=>{
        await interaction.reply({ 
          embeds:[{
            author:{
              name: "作成できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            color: Colors.Red,
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
      })
  }else if(interaction.customId === "close"){
    await interaction.channel.delete()
      .catch(async(error)=>{
        await interaction.reply({ 
          embeds:[{
            author:{
              name: "チケットを削除できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            color: Colors.Red,
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
      })
  }
}