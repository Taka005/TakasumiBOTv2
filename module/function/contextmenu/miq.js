module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "Make it a Quote"){
    const message = interaction.options.getMessage("message");

    if(!message.cleanContent) return await interaction.reply({
      embeds:[{
        author:{
          name: "生成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        color: Colors.Red,
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    await interaction.editReply("生成中...");

    const image = await fetch(`${config.api.miq}/?name=${message.author.username}&id=${message.author.id}&content=${message.cleanContent.replace("#","＃")}&icon=${message.author.avatarURL({extension:"png",size:1024})||message.author.defaultAvatarURL}`)
      .then(res=>res.blob());

    await interaction.editReply({
      content: `[生成元](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`,
      files:[
        new AttachmentBuilder()
          .setFile(image.stream())
          .setName("TakasumiBOT_Quote.png")
      ],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`miq_normal_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1074996848839884862"),
            new ButtonBuilder()
              .setCustomId(`miq_color_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1131187775937458216"),
            new ButtonBuilder()
              .setCustomId(`miq_reverse_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1131189335379689482"),
            new ButtonBuilder()
              .setCustomId(`miq_white_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1131189576841560115"),
            new ButtonBuilder()
              .setCustomId(`miq_reverseColor_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1131191439666196531"),
            new ButtonBuilder()
              .setCustomId(`miq_reverseWhite_${interaction.user.id}_${message.id}`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("1131190834843353158"))
      ]
    });
  }
}