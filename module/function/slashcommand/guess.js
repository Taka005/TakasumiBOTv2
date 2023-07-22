module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const random = require("../../lib/random");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "guess"){
    const amount = interaction.options.getInteger("money");
    const number = interaction.options.getString("number");

    const answer = random(["1","2","3","4","5","6","7","8"]);

    const data = await money.get(interaction.user.id);
    if(amount < 0||amount > data.amount) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "失敗しました",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "賭ける金額は0円以上かつ、自分の所持金の範囲です"
      }],
      ephemeral: true
    });

    if(answer === number){
      await money.add(interaction.user.id,Math.round(amount*1.5));
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "勝利",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${Math.round(amount*1.5)}円ゲットしました`
        }]
      });
    }else{
      await money.delete(interaction.user.id,amount);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "敗北",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${amount}円失いました`
        }]
      });
    }
  }
}