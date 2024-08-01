module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  const mute = require("../../lib/mute");
  const fetchUser = require("../../lib/fetchUser");
  const fetchGuild = require("../../lib/fetchGuild");
  const config = require("../../../config.json");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("report_")){
    const data = interaction.customId.split("_");

    const type = {
      "muteUser": "ユーザーをミュート",
      "unMuteUser": "ユーザーのミュートを解除",
      "muteServer": "サーバーをミュート",
      "unMuteServer": "サーバーのミュートを解除",
      "muteIp": "IPをミュート",
      "unMuteIp": "IPミュートを解除",
      "warn": "警告",
      "delete": "棄却"
    }

    const admin = (await db(`SELECT * FROM admin WHERE id = "${interaction.user.id}"`))[0];
    if(!admin) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "通報を処理できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "管理者しか実行できません"
      }],
      ephemeral: true
    });

    const report = (await db(`SELECT * FROM report WHERE id = "${data[2]}"`))[0];
    if(!report) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "通報を処理できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "無効な通報です"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    try{
      if(data[1] === "muteUser"){
        await mute.addUser(report.target,report.title);
      }else if(data[1] === "unMuteUser"){
        await mute.removeUser(report.target);
      }else if(data[1] === "muteServer"){
        await mute.addServer(report.target,report.title);
      }else if(data[1] === "unMuteServer"){
        await mute.removeServer(report.target);
      }else if(data[1] === "muteIp"){
        const account = (await db(`SELECT * FROM account WHERE id = "${report.target}";`))[0];

        await mute.addIp(account.ip,report.title);
      }else if(data[1] === "unMuteIp"){
        const account = (await db(`SELECT * FROM account WHERE id = "${report.target}";`))[0];

        await mute.removeIp(account.ip);
      }else if(data[1] === "warn"){
        if(report.type === "user"){
          const user = await fetchUser(interaction.client,report.target);
          if(!user) return await interaction.editReply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "通報を処理できませんでした",
                icon_url: "https://cdn.takasumibot.com/images/system/error.png"
              },
              description: "対象のユーザーが存在しません"
            }]
          });

          await user.send({
            embeds:[{
              color: Colors.Yellow,
              author:{
                name: "TakasumiBOTから警告されました",
                icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
              },
              description: `あなたは以下の理由によって通報されたことにより警告されました\n繰り返し警告されるとサービスの利用を拒否する場合があります\n\n${report.reason}\n\n質問や異議申し立ては[サポートサーバー](${config.inviteUrl})まで`
            }]
          });
        }else{
          const guild = await fetchGuild(interaction.client,report.target);
          if(!guild) return await interaction.editReply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "通報を処理できませんでした",
                icon_url: "https://cdn.takasumibot.com/images/system/error.png"
              },
              description: "対象のサーバーが存在しません"
            }]
          });

          const owner = await guild.fetchOwner();

          await owner.send({
            embeds:[{
              color: Colors.Yellow,
              author:{
                name: "TakasumiBOTから警告されました",
                icon_url: "https://cdn.takasumibot.com/images/system/warn.png"
              },
              description: `あなたが所有している${guild.name}(${guild.id})のサーバーは以下の理由によって通報されたことにより警告されました\n繰り返し警告されるとサービスの利用を拒否する場合があります\n\n${report.reason}\n\n質問や異議申し立ては[サポートサーバー](${config.inviteUrl})まで`
            }]
          });
        }
      }else if(data[1] === "delete"){
        await db(`DELETE FROM report WHERE id = "${report.id}"`);
      }

      await interaction.message.edit({
        embeds: interaction.message.embeds,
        components: []
      });

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "通報を処理しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          description: `${type[data[1]]}しました`,
          footer:{
            text: `${interaction.user.displayName}(${interaction.user.id})`,
            icon_url: interaction.user.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
          }
        }]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "通報を処理できませんでした",
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