module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  require("dotenv").config();
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "trade"){
    let price = Number((await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock);

    if(interaction.options.getSubcommand() === "buy"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(Number(data.amount)<count*price||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "所持金の範囲内にする必要があります"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET stock = ${Number(data.stock) + count} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*price);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}円の株を${count}個(${count*price}円)購入しました`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          }
        }]
      });

      for(let i = 1;i <= count;i++){
        price += Math.round(price*(Math.random()*0.002 + 0.001));
      }

      await db(`UPDATE count SET stock = ${price} WHERE id = ${process.env.ID};`);
    }else if(interaction.options.getSubcommand() === "sell"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(Number(data.stock)<count||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "売却できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "所持している株が不足しています"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET stock = ${Number(data.stock) - count} WHERE id = ${interaction.user.id}`);
      await money.add(interaction.user.id,count*price);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}円の株を${count}個(${count*price}円)売却しました`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          }
        }]
      });

      for(let i = 1;i <= count;i++){
        price -= Math.round(price*(Math.random()*0.002 + 0.001));
      }

      await db(`UPDATE count SET stock = ${price} WHERE id = ${process.env.ID};`);
    }else if(interaction.options.getSubcommand() === "info"){

      await interaction.deferReply();
      try{
        const trade = await db("SELECT * FROM trade;");

        const data = await fetch(`${config.api.graph}/line`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "x": trade.map(d=>new Date(d.time).toLocaleString()),
            "y": trade.map(d=>Number(d.price)),
            "title": "株価",
            "xLabel": "時間",
            "yLabel": "円"
          })
        }).then(res=>res.blob());

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "株価情報",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `現在の株価: ${price}円`,
            image:{
              url: "attachment://price.png"
            }
          }],
          files:[
            new AttachmentBuilder()
              .setFile(data.stream())
              .setName("price.png")
          ]
        });
      }catch(error){
        await interaction.editReply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "表示できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
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
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
          ]
        });
      }
    }
  }
}