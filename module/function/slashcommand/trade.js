module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  const sign = require("../../lib/sign");
  const time = require("../../lib/time");
  require("dotenv").config();
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "trade"){
    const price = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock;

    if(interaction.options.getSubcommand() === "buy"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      const commission = Math.floor(count*price*0.03 + count*0.5);

      if(data.amount<count*price+commission||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "所持金の範囲内にする必要があります\n※株の購入には手数料かかります"
        }],
        ephemeral: true
      });

      if(data.stock + count > 800) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "800株までしか購入できません"
        }],
        ephemeral: true
      });

      const history = await db(`SELECT * FROM history WHERE user = ${interaction.user.id} and ( reason = "株の購入" OR reason = "株の売却" ) ORDER BY time DESC;`);
      if(history[0]&&new Date() - history[0].time <= 300000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `次に取引できるまであと${time(300000 - (new Date() - history[0].time))}です`
        }],
        ephemeral: true
      });

      const debt = await db(`SELECT * FROM debt WHERE id = ${interaction.user.id};`);
      if(!debt[0]){
        await db(`UPDATE count SET stock = stock + ${Math.floor(count*0.01)} WHERE id = ${process.env.ID}`);
      }

      await db(`UPDATE count SET buy = buy + 1 WHERE id = ${process.env.ID}`);
      await db(`UPDATE money SET stock = ${data.stock + count} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*price,"株の購入");
      await money.delete(interaction.user.id,commission,"株の購入手数料");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}コインの株を${count}株(${count*price}コイン)購入しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `手数料: ${commission}コイン`
        }]
      });
    }else if(interaction.options.getSubcommand() === "sell"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(data.stock<count||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "売却できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "所持している株が不足しています"
        }],
        ephemeral: true
      });

      const history = await db(`SELECT * FROM history WHERE user = ${interaction.user.id} and ( reason = "株の購入" OR reason = "株の売却" ) ORDER BY time DESC;`);
      if(history[0]&&new Date() - history[0].time <= 300000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "売却できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `次に取引できるまであと${time(300000 - (new Date() - history[0].time))}です`
        }],
        ephemeral: true
      });

      const debt = await db(`SELECT * FROM debt WHERE id = ${interaction.user.id};`);
      if(!debt[0]){
        await db(`UPDATE count SET stock = stock - ${Math.floor(count*0.02)} WHERE id = ${process.env.ID}`);
      }

      await db(`UPDATE count SET sell = sell + 1 WHERE id = ${process.env.ID}`);
      await db(`UPDATE money SET stock = ${data.stock - count} WHERE id = ${interaction.user.id}`);
      await money.add(interaction.user.id,count*price,"株の売却");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}コインの株を${count}株(${count*price}コイン)売却しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(interaction.options.getSubcommand() === "graph"){

      await interaction.deferReply();
      try{
        const trade = await db("SELECT * FROM trade WHERE time >= DATE_SUB(NOW(),INTERVAL 1 DAY);");
        const time = trade.map(d=>new Date(d.time));
        const prices = trade.map(d=>d.price);

        prices.pop();
        prices.push(price);

        const high = Math.max(...trade.map(d=>d.price));
        const low = Math.min(...trade.map(d=>d.price));
        const priceDeff = prices[prices.length - 1] - prices[prices.length - 2];
        const pricePer = ((priceDeff / prices[prices.length - 2])*100).toFixed(2);

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
            "yLabel": "コイン",
            "xFont": 1
          })
        }).then(res=>res.blob());

        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "株式情報",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `現在の株価: ${price}コイン\n変動額: ${sign(priceDeff)}コイン(${pricePer}%)\n最高額: ${high}コイン\n最低額: ${low}コイン`,
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