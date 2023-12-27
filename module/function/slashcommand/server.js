module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const boost = require("../../lib/boost");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "server"){

    await interaction.deferReply();
    try{
      const members = await interaction.guild.members.fetch();

      const bot = members.filter(m=>m.user.bot);

      const online = members.filter(member=>member.presence?.status === "online");
      const dnd = members.filter(member=>member.presence?.status === "dnd");
      const idle = members.filter(member=>member.presence?.status === "idle");
      const offline = members.filter(member=>member.presence?.status === "offline"||!member.presence?.status);

      const web = members.filter(member=>member.presence?.clientStatus?.web);
      const mobile = members.filter(member=>member.presence?.clientStatus?.mobile);
      const desktop = members.filter(member=>member.presence?.clientStatus?.desktop);

      const channels = await interaction.guild.channels.fetch();

      const text = channels.filter(ch=>ch.type === ChannelType.GuildText);
      const voice = channels.filter(ch=>ch.type === ChannelType.GuildVoice);
      const category = channels.filter(ch=>ch.type === ChannelType.GuildCategory);

      const roles = await interaction.guild.roles.fetch();
      const emojis = await interaction.guild.emojis.fetch();
      const stickers = await interaction.guild.stickers.fetch();

      const shardCount = interaction.client.shard ? `\nシャード:${interaction.client.shard.shardIdForGuildId(interaction.guild.id,config.shards)}番`:""

      const stats = await db(`SELECT * FROM stats WHERE id = ${interaction.guild.id};`);

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.guild.name}の情報`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          thumbnail:{
            url: interaction.guild.iconURL({extension:"png",size:1024})
          },
          fields:[
            {
              name: "ID",
              value: interaction.guild.id
            },
            {
              name: "所有者",
              value: `<@${interaction.guild.ownerId}>`
            },
            {
              name: "人数",
              value: `${interaction.guild.memberCount}人(ユーザー:${interaction.guild.memberCount - bot.size}人 BOT:${bot.size}人)`
            },
            {
              name: "作成日時",
              value: `${interaction.guild.createdAt.toLocaleString()}\n(${Math.round((Date.now() - interaction.guild.createdAt) / 86400000)}日前)`
            },
            {
              name: "アクティビティ",
              value: `🟢: ${online.size}人 ⛔: ${dnd.size}人 🌙: ${idle.size}人 ⚫: ${offline.size}人\n🌐: ${web.size}人 📱: ${mobile.size}人 🖥️: ${desktop.size}人`
            },
            {
              name: "その他",
              value: `チャンネル:${channels.size}個(💬:${text.size} 🔊:${voice.size} 📁:${category.size})\nロール:${roles.size}個\n絵文字:${emojis.size}個\nステッカー:${stickers.size}個\nNitro:${interaction.guild.premiumSubscriptionCount}ブースト(${boost(interaction.guild.premiumSubscriptionCount)}レベル)${shardCount}`
            },
            {
              name: "統計情報",
              value: stats[0] ? `メッセージ数: ${stats[0].message}回\n参加数: ${stats[0].join}人\n脱退数: ${stats[0].leave}人` : "設定されていません"
            }
          ],
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      })
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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