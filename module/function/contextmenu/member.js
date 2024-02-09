module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const platform = require("../../lib/platform");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "メンバー情報を表示"){
    const member = interaction.options.getMember("user");

    const status = {
      "online": "🟢オンライン",
      "offline": "⚫オフライン",
      "dnd": "⛔取り込み中",
      "idle": "🌙退席中"
    };

    if(!member) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メンバーを取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したメンバーはサーバーに存在していません"
      }],
      ephemeral: true
    });

    try{
      const account = await db(`SELECT * FROM account WHERE id = ${member.user.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${member.user.displayName}の検索結果`,
            url: `https://discord.com/users/${member.user.id}`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
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
              name: "ステータス",
              value: member.presence?.status ? `${status[member.presence?.status]}\n${platform(member.presence)||""}` : "取得不可",
              inline: true
            },
            {
              name: "作成日時",
              value: `${member.user.createdAt.toLocaleString()}\n(${Math.round((Date.now() - member.user.createdAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "参加日時",
              value: `${member.joinedAt.toLocaleString()}\n(${Math.round((Date.now() - member.joinedAt) / 86400000)}日前)`,
              inline: true
            },
            {
              name: "アカウントの種類",
              value: member.user.bot ? "BOT" : "ユーザー",
              inline: true
            },
            {
              name: "TakasumiBOT Account",
              value: account[0] ? "登録済み" : "未登録",
              inline: true
            },
            {
              name: "ロール",
              value: member.roles.cache.toJSON().join("")
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
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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
      });
    }
  }
}