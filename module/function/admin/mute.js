module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const mute = require("../../lib/mute");
  const fetchUser = require("../../lib/fetchUser");
  const fetchGuild = require("../../lib/fetchGuild");
  if(interaction.options.getSubcommand() === "mute"){
    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");
    const reason = interaction.options.getString("reason")||"なし";

    if(type === "user"){
      const user = await fetchUser(interaction.client,id);
      if(!user) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ユーザーをミュートできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "指定したユーザーが存在しません"
        }],
        ephemeral: true
      });

      if(await mute.getUser(user.id)){
        await mute.removeUser(user.id);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag}(${user.id}) のミュートを解除しました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await mute.addUser(user.id,reason);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${user.tag}(${user.id}) をミュートしました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }else if(type === "server"){
      const guild = await fetchGuild(interaction.client,id);
      if(!guild) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "サーバーをミュートできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "指定したサーバーが存在しません"
        }],
        ephemeral: true
      });

      if(await mute.getServer(guild.id)){
        await mute.removeServer(guild.id);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${guild.name}(${guild.id}) のミュートを解除しました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await mute.addServer(guild.id,reason);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${guild.name}(${guild.id}) をミュートしました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }else if(type === "ip"){
      if(await mute.getIp(id)){
        await mute.removeIp(id);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${id} のミュートを解除しました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else{
        await mute.addIp(id,reason);

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${id} をミュートしました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }
  }
}