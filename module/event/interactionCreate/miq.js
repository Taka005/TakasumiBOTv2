module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const fetchMessage = require("../lib/fetchMessage");
  const config = require("../../../config.json");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("change_")){
    const data = interaction.customId.split("_");

    if(interaction.user.id !== data[2]) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "編集できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "作成者のみが操作可能です"
      }],
      ephemeral: true
    });

    const message = await fetchMessage(interaction.channel,data[3]);
    if(!message) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "編集できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "BOTの権限が不足しているか引用元のメッセージが存在しません"
      }],
      ephemeral: true
    });

    const image = await fetch(`${config.api.miq}/?type=${data[1]}&name=${message.author.username}&id=${message.author.id}&content=${message.cleanContent.replace("#","＃")}&icon=${message.author.avatarURL({extension:"png",size:1024})||message.author.defaultAvatarURL}`)
      .then(res=>res.blob());

    try{
      await interaction.message.edit({
        content: interaction.message.content,
        files:[
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName(`TakasumiBOT_MIQ.png`)
        ],
        components: interaction.message.components
      });

      await interaction.deferUpdate({});
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "編集できませんでした",
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
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true
      });
    }
  }
}