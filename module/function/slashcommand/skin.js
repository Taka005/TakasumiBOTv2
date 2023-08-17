module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "skin"){
    const name = interaction.options.getString("name");

    await interaction.deferReply();
    try{
      const image = await fetch(`https://minotar.net/armor/body/${name}/100.png`);
      
      if(!image.headers.get("Content-Type").startsWith("image/")) return await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得出来ませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "指定したユーザーは存在しません"
        }]
      });

      const link = (await fetch(`https://minotar.net/download/${name}`))
        .headers.get("Content-Disposition")
        .match(/filename="([^"]+)"/)[1]
        .replace(/\.png$/,"");

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${name}のスキン`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          image:{
            url: "attachment://skin.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile((await image.blob()).stream())
            .setName("skin.png")
        ],
        components:[
          new ActionRowBuilder()
            .addComponents( 
              new ButtonBuilder()
                .setLabel("スキンをダウンロード")
                .setURL(`https://textures.minecraft.net/texture/${link}`)
                .setStyle(ButtonStyle.Link))
        ]
      });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得出来ませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "違うユーザー名で試してください"
        }]
      });
    }
  }
}