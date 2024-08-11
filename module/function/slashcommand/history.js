module.exports = async(interaction)=>{
  const { Colors, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const db = require("../../lib/db");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "history"){

    await interaction.deferReply();
    try{
      const history = await db(`SELECT * FROM history WHERE user = ${interaction.user.id} AND time > DATE_SUB(NOW(),INTERVAL 1 DAY) ORDER BY time LIMIT 30;`);

      if(!history[0]) return await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "取引履歴が存在しません"
        }]
      });

      const table = history.map(his=>([
        his.id,
        his.reason,
        `${his.amount}コイン`,
        new Date(his.time).toLocaleString()
      ]));

      table.push([
        "-",
        "-",
        "-",
        `合計:${history.reduce((pre,his)=>pre+his.amount,0)}コイン`
      ]);

      const data = await fetch(`${config.api.graph}/table`,{
        "method": "POST",
        "headers":{
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "label": ["取引ID","内容","金額","取引日時"],
          "data": table
        })
      }).then(res=>res.blob());

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "取引履歴",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `過去30件分を表示しています\n[TakasumiBOT History](https://history.takasumibot.com/?user=${interaction.user.id})からも確認できます`,
          image:{
            url: "attachment://history.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(data.stream())
            .setName("history.png")
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "表示できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL(config.inviteUrl)
                .setStyle(ButtonStyle.Link))
        ]
      });
    }
  }
}