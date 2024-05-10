module.exports = async(interaction)=>{
  const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  const products = require("../../../file/products");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "money"){

    if(interaction.options.getSubcommand() === "info"){
      const rank = (await db("SELECT * FROM money;"))
        .sort((m1,m2)=>m2.amount - m1.amount)
        .map(m=>m.id);

      const data = await money.get(interaction.user.id);
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${interaction.user.tag}の持ち物`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "残高",
              value: `${data.amount}コイン`
            },
            {
              name: "アイテム",
              value: `${products.map(pro=>`${pro.name}: ${data[pro.id]}`).join("\n")}\n株: ${data.stock}個`,
            },
            {
              name: "順位",
              value: `${rank.indexOf(interaction.user.id)+1}/${rank.length}位`
            }
          ]
        }]
      });
    }else if(interaction.options.getSubcommand() === "log"){

      await interaction.deferReply();
      try{
        const history = (await db(`SELECT * FROM history WHERE user = ${interaction.user.id}`));

        if(!history[0]) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "表示できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "取引履歴が存在しません"
          }],
          ephemeral: true
        });

        const table =  history
          .map(his=>([
            his.id,
            his.reason,
            `${his.amount}コイン`,
            new Date(his.time).toLocaleString()
          ]))
          .reverse();

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
            description: "過去3日分を表示しています",
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
}