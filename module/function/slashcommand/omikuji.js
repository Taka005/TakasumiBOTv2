module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const random = require("../../lib/random");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "omikuji"){

    const draws = [
      //大吉
      "https://cdn.taka.cf/images/omikuji/daikiti_1.png",
      "https://cdn.taka.cf/images/omikuji/daikiti_2.png",
      "https://cdn.taka.cf/images/omikuji/daikiti_3.png",
      //大凶
      "https://cdn.taka.cf/images/omikuji/daikyou_1.png",
      "https://cdn.taka.cf/images/omikuji/daikyou_2.png",
      //吉
      "https://cdn.taka.cf/images/omikuji/kiti_1.png",
      "https://cdn.taka.cf/images/omikuji/kiti_2.png",
      "https://cdn.taka.cf/images/omikuji/kiti_3.png",
      "https://cdn.taka.cf/images/omikuji/kiti_4.png",
      "https://cdn.taka.cf/images/omikuji/kiti_5.png",
      //凶
      "https://cdn.taka.cf/images/omikuji/kyou_1.png",
      "https://cdn.taka.cf/images/omikuji/kyou_2.png",
      "https://cdn.taka.cf/images/omikuji/kyou_3.png",
      "https://cdn.taka.cf/images/omikuji/kyou_4.png",
      //小吉
      "https://cdn.taka.cf/images/omikuji/syoukiti_1.png",
      "https://cdn.taka.cf/images/omikuji/syoukiti_2.png",
      "https://cdn.taka.cf/images/omikuji/syoukiti_3.png",
      "https://cdn.taka.cf/images/omikuji/syoukiti_4.png",
      "https://cdn.taka.cf/images/omikuji/syoukiti_5.png",
      //中吉
      "https://cdn.taka.cf/images/omikuji/tyuukiti_1.png",
      "https://cdn.taka.cf/images/omikuji/tyuukiti_2.png",
      "https://cdn.taka.cf/images/omikuji/tyuukiti_3.png",
      "https://cdn.taka.cf/images/omikuji/tyuukiti_4.png"
    ];

    await interaction.deferReply();

    const image = await fetch(random(draws))
      .then(res=>res.blob());

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        image:{
          url: "attachment://omikuji.png"
        }
      }],
      files:[
        new AttachmentBuilder()
          .setFile(image.stream())
          .setName("omikuji.png")
      ]
    });
  }
}
