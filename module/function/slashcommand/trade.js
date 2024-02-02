module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  const sign = require("../../lib/sign");
  require("dotenv").config();
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "trade"){
    let price = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock;

    if(interaction.options.getSubcommand() === "buy"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(data.amount<count*price||count<1) return await interaction.reply({
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

      if(data.stock + count > 1000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "1000株までしか購入できません"
        }],
        ephemeral: true
      });

      await db(`UPDATE money SET stock = ${data.stock + count} WHERE id = ${interaction.user.id}`);
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

      price += Math.round(price*(Math.random()*0.04 + 0.01));

      await db(`UPDATE count SET stock = ${price} WHERE id = ${process.env.ID};`);
    }else if(interaction.options.getSubcommand() === "sell"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(data.stock<count||count<1) return await interaction.reply({
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

      await db(`UPDATE money SET stock = ${data.stock - count} WHERE id = ${interaction.user.id}`);
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

      price -= Math.round(price*(Math.random()*0.04 + 0.01));

      await db(`UPDATE count SET stock = ${price} WHERE id = ${process.env.ID};`);
    }else if(interaction.options.getSubcommand() === "info"){

      await interaction.deferReply();
      try{
        const trade = await db("SELECT * FROM trade");
        const time = trade.map(d=>new Date(d.time));
        const prices = trade.map(d=>d.price);
        time.push(new Date())
        prices.push(price);

        const high = Math.max(...trade.map(d=>d.price));
        const low = Math.min(...trade.map(d=>d.price));

        const data = await fetch(`${config.api.graph}/line`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "x": time,
            "y": prices,
            "title": "株価",
            "xLabel": "時間",
            "yLabel": "円",
            "xFont": 1
          })
        }).then(res=>res.blob());

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "株式情報",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `現在の株価: ${price}円\n変動額: ${sign(price - trade[trade.length - 1].price)}円\n最高額: ${high}円\n最低額: ${low}円`,
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