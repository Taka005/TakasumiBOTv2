module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const money = require("../../lib/money");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "hedge"){

    if(interaction.options.getSubcommand() === "contract"){
      const plan = interaction.options.getString("plan");

      const hedge = await db(`SELECT * FROM hedge WHERE id = ${interaction.user.id};`);
      if(hedge[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "保険を契約できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "既に契約をしています"
        }],
        ephemeral: true
      });

      const data = await money.get(interaction.user.id);

      if(data.amount<plan*3) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "契約できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "契約する金額の3倍の所持金が必要です"
        }],
        ephemeral: true
      });

      await db(`INSERT INTO hedge (id, plan, amount, time) VALUES("${interaction.user.id}","${plan}","${plan}",NOW());`);
      await money.delete(interaction.user.id,plan,"保険の契約");

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `保険を${plan}コインで契約しました`,
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `毎日${plan}コインを支払う必要があります`
        }]
      });
    }else if(interaction.options.getSubcommand() === "receive"){
      const amount = interaction.options.getInteger("amount");

      const hedge = await db(`SELECT * FROM hedge WHERE id = ${interaction.user.id};`);
      if(!hedge[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "保険金を受け取りできませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "保険を契約していません"
        }],
        ephemeral: true
      });

      if(amount){
        if(amount <= 0||hedge[0].amount < amount) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "保険金を受け取りできませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "保険金以上の金額を支払うことはできません"
          }],
          ephemeral: true
        });

        if(hedge[0].amount === amount){
          await db(`DELETE FROM hedge WHERE id = ${interaction.user.id};`);
          await money.add(interaction.user.id,hedge[0].amount,"保険金の受け取り");

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${hedge[0].amount}コインの保険金を受け取りました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }else{
          await db(`UPDATE hedge SET amount = amount - ${amount} WHERE id = ${interaction.user.id};`);
          await money.add(interaction.user.id,amount,"保険金の受け取り");

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${amount}コインの保険金を受け取りました`,
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              }
            }]
          });
        }
      }else{
        await db(`DELETE FROM hedge WHERE id = ${interaction.user.id};`);
        await money.add(interaction.user.id,hedge[0].amount,"保険金の受け取り");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: `${hedge[0].amount}コインの保険金を受け取りました`,
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }
  }
}