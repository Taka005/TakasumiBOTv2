module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const time = require("../../lib/time");
  const fetchGuild = require("../../lib/fetchGuild");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "list"){

    const servers = await Promise.all((await db(`SELECT * FROM server;`))
      .sort((s1,s2)=>new Date(s2.time) - new Date(s1.time))
      .map(async(server)=>({
        guild: await fetchGuild(interaction.client,server.id),
        url: `https://discord.gg/${server.code}`,
        text: server.text,
        time: time(new Date()-new Date(server.time))
      })));

    servers.length = 8;

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "サーバー一覧",
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: servers.map(server=>`**[${server.guild.name}](${server.url})** - ${server.time}前\n${server.text.slice(0,50)}...`).join("\n\n")
      }]
    });
  }
}