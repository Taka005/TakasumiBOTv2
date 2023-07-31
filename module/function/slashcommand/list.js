module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  const fetchGuild = require("../../lib/fetchGuild");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "list"){

    const servers = (await db(`SELECT * FROM server;`))
      .sort((s1,s2)=>new Date(s2.time) - new Date(s1.time));

    servers.length = 5;

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "サーバー一覧",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: servers.map(server=>`**[${server.name}](https://discord.gg/${server.url})(${server.members}人)** - ${time(new Date()-new Date(server.time))}前\n${server.text}`).join("\n\n")
      }]
    });
  }
}