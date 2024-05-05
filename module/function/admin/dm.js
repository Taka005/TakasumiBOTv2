module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const fetchUser = require("../../lib/fetchUser");
  const config = require("../../../config.json");
  if(interaction.options.getSubcommand() === "dm"){
    const id = interaction.options.getString("id");
    const message = interaction.options.getString("message");

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

    await interaction.deferReply();
    try{
      await user.send({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "TakasumiBOTから通知されました",
            icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
          },
          description: `${message}\n\n質問は[サポートサーバー](${config.inviteUrl})まで`
        }]
      });

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${user.displayName}(${user.id})にメッセージを送信しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: message
        }]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ユーザーにメッセージを送信できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }]
      });
    }
  }
}