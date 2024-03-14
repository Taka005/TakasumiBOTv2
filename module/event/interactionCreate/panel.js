const spam = require("../../lib/spam");
const Spam = new spam(5000,true);

module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const sleep = require("../../lib/sleep");
  const config = require("../../../config.json");
  if(!interaction.isStringSelectMenu()) return;
  if(interaction.customId === "role"){

    if(Spam.count(interaction.guild.id)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "ロールの付与に失敗しました",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "ロールの付与速度が速すぎるため5秒間待ってください"
      }],
      ephemeral: true
    });

    await interaction.deferReply({ephemeral: true});
    try{
      const add = interaction.values.filter(role=>!interaction.member.roles.cache.has(role))
      const remove = interaction.values.filter(role=>!add.includes(role));

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          description: "ロールを変更中..."
        }],
        ephemeral: true
      });

      await Promise.all(add.map(async(role)=>{
        await sleep(500);
        await interaction.member.roles.add(role)
          .catch(()=>{});
      }));

      await Promise.all(remove.map(async(role)=>{
        await sleep(500);
        await interaction.member.roles.remove(role)
          .catch(()=>{});
      }));

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "ロールを変更しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "付与したロール",
              value: add.map(role=>`<@&${role}>`).join("\n")||"なし"
            },
            {
              name: "削除したロール",
              value: remove.map(role=>`<@&${role}>`).join("\n")||"なし"
            }
          ]
        }],
        ephemeral: true
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ロールの変更に失敗しました",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "BOTの権限が不足しているか、付与するロールがBOTより上の可能性があります",
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
        ],
        ephemeral: true
      });
    }
  }
}