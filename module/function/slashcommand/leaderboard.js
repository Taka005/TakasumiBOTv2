module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "leaderboard"){

    await interaction.deferReply();

    const data = (await db("SELECT * FROM money;"))
      .sort((m1,m2)=>m2.amount - m1.amount);

    data.length = 15;

    const rank = await Promise.all(data.map(async(data,i)=>{
      const user = await fetchUser(interaction.client,data.id);

      return `**${i+1}位** ${user ? `${user.displayName}(${user.username})` : "不明"} - ${data.amount}円`;
    }));

    await interaction.editReply({
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