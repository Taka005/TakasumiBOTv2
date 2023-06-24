module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  const fetchMember = require("../../lib/fetchMember");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "user"){
    const id = interaction.options.getString("id");

    const status = {
      "online": "🟢オンライン",
      "offline": "⚫オフライン",
      "dnd": "⛔取り込み中",
      "idle": "🌙退席中"
    };

    if(!id){
      const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id} LIMIT 1;`);

      return await interaction.reply({
        embeds:[{
          color: Colors.Green,
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
            url: interaction.user.avatarURL({extension:"png",size:1024})|| interaction.user.defaultAvatarURL
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
              name: "ステータス",
              value: `${status[interaction.member.presence?.status]||"取得不可"}`,
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
              value: account[0] ? "登録済み" : "未登録"
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
            color: Colors.Red,
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
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
        })
      });
    }
  
    const userId = id.match(/\d{18,19}/g);
    if(!userId) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "ユーザーID、メンションを入力してください"
      }],
      ephemeral: true
    });

    const member = await fetchMember(interaction.guild,userId[0]);
    if(member){
      const account = await db(`SELECT * FROM account WHERE id = ${member.user.id} LIMIT 1;`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${member.user.tag}の検索結果`,
            url: `https://discord.com/users/${member.user.id}`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          thumbnail:{
            url: member.user.avatarURL({extension:"png",size:1024})||member.user.defaultAvatarURL
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
              name: "状態",
              value: `${status[member.presence?.status]||"取得不可"}`,
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
              value: account[0] ? "登録済み" : "未登録",
              inline: true
            },
            {
              name: "ロール",
              value: member.roles.cache.map(r=>r).join("")
            }
          ],
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
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
        })
      });   
    }else{
      try{
        const user = await fetchUser(interaction.client,userId[0]);
        const account = await db(`SELECT * FROM account WHERE id = ${user.id} LIMIT 1;`);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag}の検索結果`,
              url: `https://discord.com/users/${user.id}`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            thumbnail:{
              url: user.avatarURL({extension:"png",size:1024})||user.defaultAvatarURL
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
                value: account[0] ? "登録済み" : "未登録"
              }
            ],
            footer:{
              text: "TakasumiBOT"
            },
            timestamp: new Date()
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            description: "指定されたユーザーは存在しないか間違っています",
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
      }
    }
  }
}
