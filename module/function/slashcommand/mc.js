module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const fetch = require("node-fetch");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "mc"){
    const ip = interaction.options.getString("ip");
    const edition = interaction.options.getString("edition");

    await interaction.deferReply();
    try{
      if(edition === "je"){
        const server = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`)
          .then(res=>res.json());

        if(!server.debug.ping&&!server.online) return await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "無効なホスト名です"
          }]
        });

        if(server.online){
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              title: ip,
              url: `https://mcsrvstat.us/server/${ip}`,
              thumbnail:{
                url: `https://api.mcsrvstat.us/icon/${ip}`,
              },
              description: "🟢 オンライン",
              fields:[
                {
                  name: "MOTD",
                  value: `\`\`\`${server.motd ? server.motd.clean.join("\n") : "なし"}\`\`\``,
                  inline: true
                },
                {
                  name: "プレイヤー",
                  value: `${server.players.online}/${server.players.max}`,
                  inline: true
                },
                {
                  name: "バージョン",
                  value: server.version,
                  inline: true
                },
                {
                  name: "IPアドレス",
                  value: `${server.ip}:${server.port}`,
                  inline: true
                }
              ],
              footer:{
                text: "TakasumiBOT"
              },
              timestamp: new Date()
            }]
          });
        }else{
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              title: ip,
              url: `https://mcsrvstat.us/server/${ip}`,
              thumbnail:{
                url: `https://api.mcsrvstat.us/icon/${ip}`,
              },
              description: "🔴 オフライン",
              footer:{
                text: "TakasumiBOT"
              },
              timestamp: new Date()
            }]
          });
        }
      }else{
        const server = await fetch(`https://api.mcsrvstat.us/bedrock/2/${encodeURIComponent(ip)}`)
          .then(res=>res.json());

        if(!server.debug.ping&&!server.online) return await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "無効なホスト名です"
          }]
        });

        if(server.online){
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              title: ip,
              url: `https://mcsrvstat.us/bedrock/${ip}`,
              thumbnail:{
                url: `https://api.mcsrvstat.us/icon/${ip}`,
              },
              description: "🟢 オンライン",
              fields:[
                {
                  name: "MOTD",
                  value: `\`\`\`${server.motd ? server.motd.clean.join("\n") : "なし"}\`\`\``,
                  inline: true
                },
                {
                  name: "プレイヤー",
                  value: `${server.players.online}/${server.players.max}`,
                  inline: true
                },
                {
                  name: "バージョン",
                  value: server.version,
                  inline: true
                },
                {
                  name: "IPアドレス",
                  value: `${server.ip}:${server.port}`,
                  inline: true
                },
                {
                  name: "ソフトウェア",
                  value: server.software,
                  inline: true
                }
              ],
              footer:{
                text: "TakasumiBOT"
              },
              timestamp: new Date()
            }]
          });
        }else{
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              title: ip,
              url: `https://mcsrvstat.us/server/${ip}`,
              thumbnail:{
                url: `https://api.mcsrvstat.us/icon/${ip}`,
              },
              description: "🔴 オフライン",
              footer:{
                text: "TakasumiBOT"
              },
              timestamp: new Date()
            }]
          });
        }
      }
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "指定したアドレスが間違っている可能性があります"
        }]
      });
    }
  }
}