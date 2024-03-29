module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const translate = require("../../lib/translate");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "英語に翻訳"){
    const message = interaction.options.getMessage("message");

    if(!message.content) return await interaction.reply({
      content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
      embeds:[{
        color: Colors.Red,
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "メッセージの内容が存在しません",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.takasumibot.com/images/translate.png"
        }
      }],
      ephemeral: true
    });

    if(message.content > 2000) return await interaction.reply({
      content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
      embeds:[{
        color: Colors.Red,
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "翻訳文字数は2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.takasumibot.com/images/translate.png"
        }
      }],
      ephemeral: true
    });

    try{
      const data = await translate(message.content,"auto","en");

      await interaction.reply({
        content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
        embeds:[{
          color: Colors.Blue,
          author:{
            name: `${message.author.tag}`,
            icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
          },
          description: data.text,
          footer:{
            text: `Google Translate [${data.source}]->[en]`,
            icon_url: "https://cdn.takasumibot.com/images/translate.png"
          }
        }]
      });
    }catch{
      await interaction.reply({
        content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
        embeds:[{
          color: Colors.Red,
          author:{
            name: "翻訳できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "翻訳文字を変えて、もう一度実行してください",
          footer:{
            text: "Google Translate",
            icon_url: "https://cdn.takasumibot.com/images/translate.png"
          }
        }],
        ephemeral: true
      });
    }
  }
}