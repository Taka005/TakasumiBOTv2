module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "英語に翻訳"){
    const message = interaction.options.getMessage("message");

    if(!message.content) return await interaction.reply({
      content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
      embeds:[{
        color: Colors.Red,
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "メッセージの内容が存在しません",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.cf/images/translate.png"
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
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "翻訳文字数は2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.cf/images/translate.png"
        }
      }],
      ephemeral: true
    });
      
    const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&dj=1&q=${encodeURIComponent(message.content)}`)
      .then(res=>res.json());
    
    try{
      const translated = data.sentences.map(sentence=>sentence.trans);

      await interaction.reply({
        content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
        embeds:[{
          color: Colors.Blue,
          author:{
            name: `${message.author.tag}`,
            icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
          },
          description: translated.join(""),
          footer:{
            text: `Google Translate [${data.src}]->[en]`,
            icon_url: "https://cdn.taka.cf/images/translate.png"
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
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "翻訳文字を変えて、もう一度実行してください",
          footer:{
            text: "Google Translate",
            icon_url: "https://cdn.taka.cf/images/translate.png"
          }
        }],
        ephemeral: true
      });
    }
  }
}