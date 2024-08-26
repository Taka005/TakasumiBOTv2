module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "leaderboard"){
    const type = interaction.options.getString("type");
    const filter = interaction.options.getString("filter");
    const range = interaction.options.getInteger("range");

    const types = {
      "money": "お金",
      "debt": "借金",
      "hedge": "保険"
    }

    let data;
    if(type === "money"){
      data = (await db("SELECT * FROM money;"))
        .sort((m1,m2)=>m2.amount - m1.amount);
    }else if(type === "debt"){
      data = (await db("SELECT * FROM debt;"))
        .sort((m1,m2)=>m2.amount - m1.amount);
    }else if(type === "hedge"){
      data = (await db("SELECT * FROM hedge;"))
        .sort((m1,m2)=>m2.amount - m1.amount);
    }

    if(filter === "local"){
      data = (await interaction.guild.members.fetch())
        .filter(member=>!member.user.bot)
        .filter(member=>data.find(d=>d.id === member.id))
        .toJSON();
    }

    if(range){
      if(range <= 0) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "正の範囲で指定してください"
        }],
        ephemeral: true
      });

      data = data.slice(range-1);

      if(!data.length) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "指定した範囲が無効です"
        }],
        ephemeral: true
      });
    }

    data.length = 15;

    await interaction.deferReply();

    const rank = await Promise.all(data.map(async(data,i)=>{
      const user = await fetchUser(interaction.client,data.id);

      return `**${i+(range||1)}位** ${user ? `${user.displayName}(${user.username})` : "不明"} - ${data.amount}コイン`;
    }));

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${filter === "local" ? "このサーバーの" : ""}${types[type]}ランキング`,
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        description: rank.join("\n")
      }]
    });
  }
}