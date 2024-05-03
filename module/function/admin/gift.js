module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const gifts = require("../../../file/gifts");
  if(interaction.options.getSubcommand() === "gift"){
    const code = interaction.options.getString("code");
    const type = interaction.options.getString("type");

    const gift = gifts.find(gift=>gift.id === type);

    if(!gift) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "作成できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "存在しない商品です"
      }],
      ephemeral: true
    });

    await db(`INSERT INTO gift (id, type, user, time) VALUES("${code}","${gift.id}","${interaction.client.user.id}",NOW());`);
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${gift.id}コインのギフトを作成しました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: `https://gift.takasumibot.com/${code}`
      }],
      ephemeral: true
    });
  }
}