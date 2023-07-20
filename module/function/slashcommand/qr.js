module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "qr"){
    const text = interaction.options.getString("text");
    const type = interaction.options.getString("type");

    if(type === "gen"){
      await interaction.deferReply();
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          title: "生成中..."
        }]
      });

      const data = await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(text)}&size=256x256&extension=png`)
        .then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "QRコードを作成しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `内容\n\`\`\`${text}\`\`\``,
          image:{
            url: "attachment://QRcode.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(data.stream())
            .setName("QRcode.png")
        ]
      });
    }else{
      if(!text.match(/^(http(s?):\/\/)([^\s/]+\/)([^\s]+\.(jpg|jpeg|png|gif))$/i)) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "QRコードが読み取れません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "QRコードは画像のURLで指定する必要があります"
        }],
        ephemeral: true
      });

      await interaction.deferReply();
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          title: "読み取り中..."
        }]
      });
      
      const data = await fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURI(text)}`)
        .then(res =>res.json());

      if(data[0].symbol[0].error) return await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "QRコードが読み取れません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "QRコードはURLかつ、読み取れる必要があります"
        }]
      });

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "QRコードを読み取りました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `内容\n\`\`\`${data[0].symbol[0].data}\`\`\``,
        }]
      });
    }
  }
}