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
    if(amount < 100||Math.round(amount*1.5) > (data.amount||0)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "失敗しました",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "賭ける金額は100コイン以上かつ、自分の所持金で払える額以下です"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    if(answer === number){
      await money.add(interaction.user.id,Math.round(amount*3),"賭けの賞金");
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "勝利",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `${Math.round(amount*3)}コインゲットしました\n所持金: ${data.amount + Math.round(amount*3)}コイン`
        }]
      });
    }else{
      await money.delete(interaction.user.id,Math.round(amount*1.5),"賭けの罰金");
      let total = data.amount - Math.round(amount*1.5);

      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "敗北",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `${Math.round(amount*1.5)}コイン失いました\n所持金: ${total}コイン`
        }]
      });
    }
  }
}
