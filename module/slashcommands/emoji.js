module.exports = async(interaction)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "emoji"){
    const name = interaction.options.getString("name");

    if(!name.match(/<(a)?:\w+:\d+>/g)) return await interaction.reply({
      embeds:[{
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "サーバー上のカスタム絵文字を指定してください"
      }],
      ephemeral: true
    });

    try{
      const emoji = await interaction.guild.emojis.fetch(name.match(/\d{18,19}/g));

      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${emoji.name}の情報`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          },
          thumbnail:{
            url: emoji.url
          },
          fields:[
            {
              name: "ID",
              value: emoji.id
            },
            {
              name: "作成者",
              value: `<@${emoji.author.id}>`
            },
            {
              name: "種類",
              value: emoji.animated ? "アニメーション画像" : "静止画像"
            },
            {
              name: "作成日時",
              value: `${new Date(emoji.createdTimestamp).toLocaleString()}\n(${Math.round((Date.now() - emoji.createdAt) / 86400000)}日前)`
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