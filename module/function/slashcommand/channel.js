module.exports = async(interaction)=>{
  const permission = require("../../lib/permission");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "channel"){
    const channel = interaction.options.getChannel("name");

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${channel.name}の情報`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        fields:[
          {
            name: "ID",
            value: channel.id,
            inline: true
          },
          {
            name: "トピック",
            value: channel.topic||"なし",
            inline: true
          },
          {
            name: "カテゴリー",
            value: channel.parent ? `<#${channel.parent.id}>` : "なし",
            inline: true
          },
          {
            name: "NSFW",
            value: channel.snfw ? "有効" : "無効",
            inline: true
          },
          {
            name: "作成日時",
            value: `${new Date(channel.createdTimestamp).toLocaleString()}\n(${Math.round((Date.now() - channel.createdAt) / 86400000)}日前)`,
            inline: true
          },
          {
            name: "メンバー数",
            value: `${channel.members.size}人`,
            inline: true
          },
          {
            name: "権限",
            value: `\`${permission(channel.permissionFor(interaction.member).toArray()).join("`,`")}\``
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
  }
}