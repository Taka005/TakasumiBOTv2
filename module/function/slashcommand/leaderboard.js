module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "leaderboard"){

    const rank = (await db("SELECT id, amount FROM money ORDER BY amount DESC LIMIT 10;"))
      .sort((m1,m2)=>m2.mount - m1.mount);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "お金持ちランキング",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: rank.map(async(data,i)=>`${i+1}位 ${(await fetchUser(data.id))?.tag||"不明"} ${data.mount}円`).join("\n")
      }]
    });
  }
}