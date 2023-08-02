module.exports = async(interaction)=>{
  const { AttachmentBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const config = require("../../../config.json");
  const fetchMessage = require("../../lib/fetchMessage");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "メッセージを報告"){
    const message = interaction.options.getMessage("message");

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ReadMessageHistory)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージ履歴の閲覧```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!message.content) return await interaction.reply({
      embeds:[{
        author:{
          name: "報告できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    const messages = await fetchMessage(message.channel,{limit:"30", around:message.id});
    if(!messages) return await interaction.reply({
      embeds:[{
        author:{
          name: "報告できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "BOTの権限が不足しています"
      }],
      ephemeral: true
    });

    await interaction.client.channels.cache.get(config.report).send({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "メッセージレポート",
          icon_url: "https://cdn.taka.cf/images/system/success.png",
        },
        footer:{
          text: `${interaction.user.tag}(${interaction.user.id})`,
          icon_url: interaction.user.avatarURL()||interaction.user.defaultAvatarURL,
        },
        timestamp: new Date()
      }],
      files:[
        new AttachmentBuilder()
          .setFile(Buffer.from(messages.reverse().map(message=>`${message.author.tag}(${message.author.id})\n${message.content}`).join("\n\n"))) 
          .setName(`REPORT_${interaction.user.id}.txt`)
      ]
    })
      .then(async()=>{
        await interaction.reply({ 
          embeds:[{
            color: Colors.Green,
            author:{
              name: "メッセージを報告しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
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
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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