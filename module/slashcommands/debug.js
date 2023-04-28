module.exports = async(interaction)=>{
  const { admin } = require("../../config.json");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "debug"){
    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");
    const channel = interaction.options.getChannel("channel");
    const json = interaction.options.getString("json");

    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });

    if(type === "content"){
      try{
        if(channel){
          const msg = await channel.messages.fetch(id);
          await interaction.reply({
            embeds:[{
              author:{
                name: "取得しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN",
              description: `\`\`\`json\n${JSON.stringify(msg,null,"  ")}\`\`\``
            }]
          });
        }else{
          const msg = await interaction.channel.messages.fetch(id);
          await interaction.reply({
            embeds:[{
              author:{
                name: "取得しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN",
              description: `\`\`\`json\n${JSON.stringify(msg,null,"  ")}\`\`\``
            }]
          });
        }
      }catch(error){
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "メッセージが存在しません",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral: true
        });
      }
    }else if(type === "send"){
      try{
        await interaction.reply(JSON.parse(json));
      }catch(error){
        await interaction.reply({
          embeds:[{
            author:{
              name: "送信できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "メッセージオブジェクトが無効です",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral: true
        });
      }
    }else if(type === "edit"){
      try{
        if(channel){
          const msg = await channel.messages.fetch(id);
          await msg.edit(JSON.parse(json));
          await interaction.reply({
            embeds:[{
              author:{
                name: "編集しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        }else{
          const msg = await interaction.channel.messages.fetch(id);
          await msg.edit(JSON.parse(json));
          await interaction.reply({
            embeds:[{
              author:{
                name: "編集しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        }
      }catch(error){
        await interaction.reply({
          embeds:[{
            author:{
              name: "編集できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "メッセージオブジェクトまたは、メッセージが取得できません",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral: true
        });
      }
    }else if(type === "delete"){
      try{
        if(channel){
          const msg = await channel.messages.fetch(id);
          msg.delete();
          await interaction.reply({
            embeds:[{
              author:{
                name: "削除しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        }else{
          const msg = await interaction.channel.messages.fetch(id);
          msg.delete();
          await interaction.reply({
            embeds:[{
              author:{
                name: "削除しました",
                icon_url: "https://cdn.taka.ml/images/system/success.png"
              },
              color: "GREEN"
            }]
          });
        }
      }catch(error){
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "メッセージが存在しません",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral: true
        });
      }
    } 
  }
}