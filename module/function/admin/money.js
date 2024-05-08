module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const fetchUser = require("../../lib/fetchUser");
  if(interaction.options.getSubcommand() === "money"){
    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");
    const count = interaction.options.getInteger("count");

    const userId = id.match(/\d{17,19}/g);
    if(!userId) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "ユーザーID、メンションを入力してください"
      }],
      ephemeral: true
    });

    const user = await fetchUser(interaction.client,userId[0]);
    if(!user) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "不明なユーザーです"
      }],
      ephemeral: true
    });

    if(type === "add"){
      await money.add(user.id,count,"管理者による調整");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.displayName}(${user.id}) に${count}コイン付与しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(type === "delete"){
      await money.delete(user.id,count,"管理者による調整");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.displayName}(${user.id}) に${count}コイン剥奪しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }
  }
}