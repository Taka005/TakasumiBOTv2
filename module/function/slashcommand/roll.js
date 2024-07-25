module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const money = require("../../lib/money");
  const rolls = require("../../../file/rolls");
  const isAdmin = require("../../lib/isAdmin");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "roll"){
    const count = interaction.options.getString("count");

    if(!await isAdmin(interaction.user.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "回せませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "この機能は調整中です"
      }],
      ephemeral: true
    });

    const data = await money.get(interaction.user.id);

    if(data.roll<count) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "回せませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "ガチャが回せるほど所有していません"
      }],
      ephemeral: true
    });

    const results = [];
    for(let i = 0;i < count;i++){
      const random = Math.random();
      let sumRate = 0;
      let result;

      for(const roll of rolls){
        sumRate += roll.rate;
        if(random < sumRate){
          result = roll;
          break;
        }
      }

      results.push(result);
      await money.add(interaction.user.id,result.price,"ガチャの景品");
    }

    await db(`UPDATE money SET roll = roll - ${count} WHERE id = ${interaction.user.id}`);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${count}回分回しました`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: results.map(result=>`${result.price}コイン`).join("\n")
      }]
    });
  }
}