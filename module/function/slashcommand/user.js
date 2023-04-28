module.exports = async(interaction,client)=>{
  const mysql = require("../lib/mysql");
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "user"){
    const id = interaction.options.getString("id");

    if(!id){
      const members = await mysql(`SELECT * FROM account WHERE id = ${interaction.user.id} LIMIT 1;`);

      return await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${interaction.user.tag}の検索結果`,
            url: `https://discord.com/users/${interaction.user.id}`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          thumbnail:{
            url: interaction.user.avatarURL({format:"png",dynamic:true,size:1024})|| interaction.user.defaultAvatarURL
          },
          fields:[
            {
              name: "ID",
              value: interaction.user.id,
              inline: true
            },
            {
              name: "ニックネーム",
              value: interaction.member.nickname||"未設定",
              inline: true
            },
            {
              name: "作成日時",
              value: `${new Date(interaction.user.createdTimestamp).toLocaleString()}\n(${Math.round((Date.now() - interaction.user.createdAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "参加日時",
              value: `${new Date(interaction.member.joinedTimestamp).toLocaleString()}\n(${Math.round((Date.now() - interaction.member.joinedAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "アカウントの種類",
              value: interaction.user.bot ? "BOT" : "ユーザー",
              inline: true
            },
            {
              name: "TakasumiBOT Accountへの登録",
              value: members[0] ? "登録済み" : "未登録"
            },
            {
              name: "ロール",
              value: interaction.member.roles.cache.map(r=>r).join("")
            }
          ]
        }]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new MessageActionRow()
              .addComponents( 
                new MessageButton()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle("LINK"))
          ],
          ephemeral: true
        })
      });
    }
  
    const ID = id.match(/\d{18,19}/g);
    if(!ID) return await interaction.reply({
      embeds:[{
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "正確にIDまたは、メンションをしてください"
      }],
      ephemeral: true
    });

    const member = await interaction.guild.members.cache.get(ID[0]);
    if(member){
      const members = await mysql(`SELECT * FROM account WHERE id = ${member.user.id} LIMIT 1;`);

      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${member.user.tag}の検索結果`,
            url: `https://discord.com/users/${member.user.id}`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          thumbnail:{
            url: member.user.avatarURL({format:"png",dynamic:true,size:1024})||member.user.defaultAvatarURL
          },
          fields:[
            {
              name: "ID",
              value: member.user.id,
              inline: true
            },
            {
              name: "ニックネーム",
              value: member.nickname||"未設定",
              inline: true
            },
            {
              name: "作成日時",
              value: `${new Date(member.user.createdTimestamp).toLocaleString()}\n(${Math.round((Date.now() - member.user.createdAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "参加日時",
              value: `${new Date(member.joinedTimestamp).toLocaleString()}\n(${Math.round((Date.now() - member.joinedAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "アカウントの種類",
              value: member.user.bot ? "BOT" : "ユーザー"
            },
            {
              name: "TakasumiBOT Accountへの登録",
              value: members[0] ? "登録済み" : "未登録",
              inline: true
            },
            {
              name: "ロール",
              value: member.roles.cache.map(r=>r).join("")
            }
          ]
        }]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new MessageActionRow()
              .addComponents( 
                new MessageButton()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle("LINK"))
          ],
          ephemeral: true
        })
      });   
    }else{
      try{
        const user = await client.users.fetch(ID[0]);
        const members = await mysql(`SELECT * FROM account WHERE id = ${user.id} LIMIT 1;`);

        await interaction.reply({
          embeds:[{
            color: "GREEN",
            author:{
              name: `${user.tag}の検索結果`,
              url: `https://discord.com/users/${user.id}`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            timestamp: new Date(),
            footer:{
              text: "TakasumiBOT"
            },
            thumbnail:{
              url: user.avatarURL({format:"png",dynamic:true,size:1024})||user.defaultAvatarURL
            },
            fields:[
              {
                name: "ID",
                value: user.id,
                inline: true
              },
              {
                name: "作成日時",
                value: `${new Date(user.createdTimestamp).toLocaleString()}`,
                inline: true
              },
              {
                name: "アカウントの種類",
                value: user.bot ? "BOT" : "ユーザー",
                inline: true
              },
              {
                name: "TakasumiBOT Accountへの登録",
                value: members[0] ? "登録済み" : "未登録"
              }
            ]
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "指定されたユーザーは存在しないか、\n間違っています",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new MessageActionRow()
              .addComponents( 
                new MessageButton()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle("LINK"))
          ],
          ephemeral: true
        });
      }
    }
  }
}
