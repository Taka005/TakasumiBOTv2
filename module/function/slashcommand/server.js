module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType, Colors } = require("discord.js");
  const boost = require("../../lib/boost");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "server"){

    await interaction.deferReply();
    try{
      const members = await interaction.guild.members.fetch();

      const online = members.filter(member=>member.presence?.status === "online");
      const dnd = members.filter(member=>member.presence?.status === "dnd");
      const idle = members.filter(member=>member.presence?.status === "idle");
      const offline = members.filter(member=>member.presence?.status === "offline"||!member.presence?.status);

      const web = members.filter(member=>member.presence?.clientStatus?.web);
      const mobile = members.filter(member=>member.presence?.clientStatus?.mobile);
      const desktop = members.filter(member=>member.presence?.clientStatus?.desktop);

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.guild.name}の情報`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          thumbnail:{
            url: interaction.guild.iconURL()
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
              value: `${interaction.guild.memberCount}人(ユーザー:${(await interaction.guild.members.fetch()).filter(m=>!m.user.bot).size}人 BOT:${(await interaction.guild.members.fetch()).filter(m=>m.user.bot).size}人)`
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
              name: "統計情報",
              value: `チャンネル:${interaction.guild.channels.cache.size}個(💬:${interaction.guild.channels.cache.filter(ch=>ch.type===ChannelType.GuildText).size} 🔊:${interaction.guild.channels.cache.filter(ch=>ch.type===ChannelType.GuildVoice).size} 📁:${interaction.guild.channels.cache.filter(ch=>ch.type===ChannelType.GuildCategory).size})\nロール:${(await interaction.guild.roles.fetch()).size}個\n絵文字:${(await interaction.guild.emojis.fetch()).size}個\nステッカー:${(await interaction.guild.stickers.fetch()).size}個\nNitro:${interaction.guild.premiumSubscriptionCount}ブースト(${boost(interaction.guild.premiumSubscriptionCount)}レベル)`
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