module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  if(interaction.options.getSubcommand() === "member"){
    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");

    const user = await fetchUser(interaction.client,id);
    if(!user) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "ユーザーを取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "指定したユーザーが存在しません"
      }],
      ephemeral: true
    });

    if(type === "add"){
      await db(`INSERT INTO admin (id, time) VALUES("${user.id}",NOW());`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.displayName}を管理者に追加しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
        }],
        ephemeral: true
      });
    }else if(type === "delete"){
      await db(`DELETE FROM admin WHERE id = "${user.id}";`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.displayName}を管理者から削除しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
        }],
        ephemeral: true
      });
    }
  }
}