const Spam = require("../../lib/spam");
const spam = new Spam(180000,true);

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
    const price = (await db(`SELECT * FROM count WHERE id = ${process.env.ID};`))[0].stock;

    if(interaction.options.getSubcommand() === "buy"){
      const count = interaction.options.getInteger("count");

      const data = await money.get(interaction.user.id);

      if(data.amount<count*price||count<1) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "所持金の範囲内にする必要があります"
        }],
        ephemeral: true
      });

      if(data.stock + count > 500) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "500株までしか購入できません"
        }],
        ephemeral: true
      });

      if(spam.count(interaction.user.id)) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "購入できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `次に取引できるまであと${Math.floor((180000 - (new Date() - spam.get(interaction.user.id)))/60000)}分です`
        }],
        ephemeral: true
      });

      await db(`UPDATE count SET buy = buy + 1 WHERE id = ${process.env.ID}`);
      await db(`UPDATE money SET stock = ${data.stock + count} WHERE id = ${interaction.user.id}`);
      await money.delete(interaction.user.id,count*price);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}コインの株を${count}株(${count*price}コイン)購入しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
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

      if(spam.count(interaction.user.id)) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "売却できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `次に取引できるまであと${Math.floor((180000 - (new Date() - spam.get(interaction.user.id)))/60000)}分です`
        }],
        ephemeral: true
      });

      await db(`UPDATE count SET sell = sell + 1 WHERE id = ${process.env.ID}`);
      await db(`UPDATE money SET stock = ${data.stock - count} WHERE id = ${interaction.user.id}`);
      await money.add(interaction.user.id,count*price);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${price}コインの株を${count}株(${count*price}コイン)売却しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else if(interaction.options.getSubcommand() === "info"){

      await interaction.deferReply();
      try{
        const trade = await db("SELECT * FROM trade");
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