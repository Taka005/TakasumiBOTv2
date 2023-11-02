module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "emoji"){
    const name = interaction.options.getString("name");

    if(!name.match(/<(a)?:\w+:\d+>/g)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "サーバーのカスタム絵文字を指定してください"
      }],
      ephemeral: true
    });

    try{
      const emoji = await interaction.guild.emojis.fetch(name.match(/\d{17,19}/g));

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "絵文字の情報",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          thumbnail:{
            url: emoji.url
          },
          fields:[
            {
              name: "名前",
              value: emoji.name
            },
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
              value: `${emoji.createdAt.toLocaleString()}\n(${Math.round((Date.now() - emoji.createdAt) / 86400000)}日前)`
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