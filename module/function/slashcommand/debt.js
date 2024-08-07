module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "debt"){

    if(interaction.options.getSubcommand() === "borrow"){
      const amount = interaction.options.getInteger("amount");

      if(amount <= 0||amount > 1000000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "借金できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "1コイン以上100万コインまでしか借りることはできません"
        }],
        ephemeral: true
      });

      const debt = await db(`SELECT * FROM debt WHERE id = ${interaction.user.id};`);
      if(debt[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "借金できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "既に借金をしているため、借りることができません"
        }],
        ephemeral: true
      });

      const data = await money.get(interaction.user.id);

      if(data.amount<amount/4) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "借金できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "借りる金額の4分の1の所持金が必要です"
        }],
        ephemeral: true
      });

      await db(`INSERT INTO debt (id, amount, time) VALUES("${interaction.user.id}","${Math.round(amount*1.03)}",NOW());`);
      await money.add(interaction.user.id,amount,"借金の借入");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${amount}コインを借りました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `返済には${Math.round(amount*1.03)}コイン必要です\n1日1%の利子がつきます\n5日以内に1コインでも返済されない場合強制的に返済されます`
        }]
      });
    }else if(interaction.options.getSubcommand() === "repay"){
      const amount = interaction.options.getInteger("amount");

      const debt = await db(`SELECT * FROM debt WHERE id = ${interaction.user.id};`);
      if(!debt[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "返済できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "借金していないため、返済できません"
        }],
        ephemeral: true
      });

      const data = await money.get(interaction.user.id);

      if(amount){
        if(amount <= 0||debt[0].amount < amount) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "返済できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "1コイン以上かつ借りている金額までしか返済することはできません"
          }],
          ephemeral: true
        });

        if(data.amount < amount) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "返済できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "返済できる分の所持金がありません"
          }],
          ephemeral: true
        });

        if(debt[0].amount === amount){
          await db(`DELETE FROM debt WHERE id = ${interaction.user.id};`);
          await money.delete(interaction.user.id,debt[0].amount,"借金の返済");

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${debt[0].amount}コインの借金を返済しました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }else{
          await db(`UPDATE debt SET amount = amount - ${amount} WHERE id = ${interaction.user.id};`);
          await money.delete(interaction.user.id,amount,"借金の返済");

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${amount}コインの借金を返済しました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              },
              description: `残り${debt[0].amount - amount}コイン返済する必要があります`
            }]
          });
        }
      }else{
        if(data.amount<debt[0].amount) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "返済できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "返済できる分の所持金がありません"
          }],
          ephemeral: true
        });

        await db(`DELETE FROM debt WHERE id = ${interaction.user.id};`);
        await money.delete(interaction.user.id,debt[0].amount,"借金の返済");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${debt[0].amount}コインの借金を返済しました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }
  }
}