module.exports = async(interaction,Lang)=>{
  const fetch = require("node-fetch");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "skin"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const res = await fetch(`https://minotar.net/armor/body/${name}/100.png`);
      if(!res.headers.get("Content-Type").startsWith("image/")) return await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得出来ませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "指定したユーザーは存在しません"
        }]
      });

      const image = await res.blob();

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${name}のスキン`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          image:{
            url: "attachment://skin.png"
          }
        }],
        files: [
          new AttachmentBuilder()
            .setFile(image.stream())
            .setName("skin.png")
        ],
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("スキンをダウンロード")
                .setURL(`https://minotar.net/download/${name}`)
                .setStyle(ButtonStyle.Link))
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得出来ませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "違うユーザー名で試してください"
        }]
      });
    }
  }
}