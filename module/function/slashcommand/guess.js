module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const random = require("../../lib/random");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "guess"){
    const amount = interaction.options.getInteger("money");
    const number = interaction.options.getString("number");

    const answer = random(["1","2","3"]);

    const data = await money.get(interaction.user.id);
    if(amount < 5||amount > data.amount) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "失敗しました",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "賭ける金額は5円以上かつ、自分の所持金の範囲です"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    if(answer === number){
      await money.add(interaction.user.id,Math.round(amount*3));
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "勝利",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${Math.round(amount*3)}円ゲットしました\n所持金: ${Number(data.amount) + Math.round(amount*3)}円`
        }]
      });
    }else{
      await money.delete(interaction.user.id,Math.round(amount*1.5));
      let total = Number(data.amount) - Math.round(amount*1.5);
      if(total < 0){
        total = 0;
      }

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "敗北",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${Math.round(amount*1.5)}円失いました\n所持金: ${total}円`
        }]
      });
    }
  }
}