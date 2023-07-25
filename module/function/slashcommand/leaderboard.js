module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "leaderboard"){

    const data = (await db("SELECT id, amount FROM money ORDER BY amount DESC LIMIT 10;"))
      .sort((m1,m2)=>m2.amount - m1.amount);
console.log(data)
    const rank = await Promise.all(data.map(async(data,i)=>`${i+1}位 ${(await fetchUser(data.id))?.tag||"不明"} ${data.amount}円`));

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "お金持ちランキング",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: rank.join("\n")
      }]
    });
  }
}