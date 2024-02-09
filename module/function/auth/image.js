module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { ActionRowBuilder, StringSelectMenuBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const random = require("../../lib/random");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("image_")){
    const data = interaction.customId.split("_");

    const keys = [
      {text:"2daAfg",url:"https://cdn.takasumibot.com/images/auth/img_1.png"},
      {text:"wad3EF",url:"https://cdn.takasumibot.com/images/auth/img_2.png"},
      {text:"G4sveS",url:"https://cdn.takasumibot.com/images/auth/img_3.png"},
      {text:"3dgHR",url:"https://cdn.takasumibot.com/images/auth/img_4.png"},
      {text:"ascA23",url:"https://cdn.takasumibot.com/images/auth/img_5.png"},
      {text:"Cd2d4s",url:"https://cdn.takasumibot.com/images/auth/img_6.png"},
      {text:"Mgfn4",url:"https://cdn.takasumibot.com/images/auth/img_7.png"},
      {text:"Hsdgs1",url:"https://cdn.takasumibot.com/images/auth/img_8.png"}
    ];

    await interaction.deferReply({ephemeral: true});

    const key = random(keys);
    const image = await fetch(key.url)
      .then(res=>res.blob());

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        title: "画像認証",
        description: "画像にある文字を選択してください\n※画像が表示されるまで時間がかかる場合があります",
        image:{
          url: "attachment://code.png"
        }
      }],
      files:[
        new AttachmentBuilder()
          .setFile(image.stream())
          .setName("code.png")
      ],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`imagerole_${data[1]}_${key.text}`)
              .setPlaceholder("正しいものを選択")
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions(
                keys.map(key=>({
                  label: key.text,
                  value: key.text
                }))
              ))
      ],
      ephemeral: true
    });
  }
}