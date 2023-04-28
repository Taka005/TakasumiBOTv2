module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  if(!interaction.isContextMenu()) return;
  if(interaction.commandName === "日本語に翻訳"){
    const message = interaction.options.getMessage("message");
    
    if(!message.content) return await interaction.reply({
      content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
      embeds:[{
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "メッセージの内容が存在しません",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.ml/images/translate.png"
        }
      }],
      ephemeral: true
    });

    if(message.content > 2000) return await interaction.reply({
      content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
      embeds:[{
        author:{
          name: "翻訳できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "翻訳文字数は、2000文字以下です",
        footer:{
          text: "Google Translate",
          icon_url: "https://cdn.taka.ml/images/translate.png"
        }
      }],
      ephemeral: true
    });
      
    const data = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ja&dt=t&dj=1&q=${encodeURIComponent(message.content)}`)
      .then(res=>res.json())
    
    try{
      const translated = data.sentences.map((sentence)=>{
        return sentence.trans;
      });

      await interaction.reply({
        content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
        embeds:[{
          author:{
            name: `${message.author.tag}`,
            icon_url: message.author.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png",
          },
          color: "BLUE",
          description: translated.join(""),
          footer:{
            text: `Google Translate [${data.src}]->[ja]`,
            icon_url: "https://cdn.taka.ml/images/translate.png"
          }
        }]
      });
    }catch{
      await interaction.reply({
        content: `[翻訳元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}/)`,
        embeds:[{
          author:{
            name: "翻訳できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "翻訳文字を変えて、もう一度実行してください",
          footer:{
            text: "Google Translate",
            icon_url: "https://cdn.taka.ml/images/translate.png"
          }
        }],
        ephemeral: true
      });
    }
  }
}