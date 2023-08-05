module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "filter"){
    const type = JSON.parse(interaction.options.getString("type"));
		const day = interaction.options.getInteger("day");

    if(day < 0||day > 90) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: `フィルターする日数は1日以上90日以下にする必要があります`
      }],
      ephemeral: true
    });

		const menbers = (await interaction.guild.members.fetch())
      .filter(member=>Math.floor((new Date()-(type ? member.joinedAt : member.user.createdAt))/86400000) <= day);

		if(!menbers.first()) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: `${day}日以内に${type?"参加":"アカウントを作成"}したメンバーが見つかりませんでした`
      }],
      ephemeral: true
    });

    await interaction.reply({ 
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${day}日以内に${type?"参加":"アカウントを作成"}したメンバー`,
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: menbers.map(m=>`${m.user.tag}(${m.id})`).join("\n")
      }]
    });
  }
}