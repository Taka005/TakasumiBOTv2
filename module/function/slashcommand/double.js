module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "double"){
		const user = interaction.options.getUser("user");

    const accounts = await db(`SELECT * FROM account;`);

		const account = accounts.find(account=>account.id === user.id);
		if(!account) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: "検出できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "指定されたユーザーはTakasumiBOTアカウントに登録されていません"
      }],
      ephemeral: true
    });

		const menbers = (await interaction.guild.members.fetch())
      .filter(member=>accounts.find(account=>account.id===member.id)?.ip === account.ip)
      .filter(member=>member.id!==user.id);

		if(!menbers.first()) return await interaction.reply({ 
      embeds:[{
        color: Colors.Red,
        author:{
          name: "検出されませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: `このサーバーでは${user.tag}のサブアカウントは存在しません`
      }]
    });

    await interaction.reply({ 
      embeds:[{
        color: Colors.Green,
        author:{
          name: "検出されました",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: menbers.map(m=>`${m.user.tag}(${m.id})`).join("\n")
      }]
    });
  }
}