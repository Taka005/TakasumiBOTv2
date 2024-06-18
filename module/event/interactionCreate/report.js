module.exports = async(interaction)=>{
  const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const fetchUser = require("../../lib/fetchUser");
  const fetchGuild = require("../../lib/fetchGuild");
  const createId = require("../../lib/createId");
  const db = require("../../lib/db");
  const mute = require("../../lib/mute");
  const config = require("../../../config.json");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId === "report"){
    const title = interaction.fields.getTextInputValue("title");
    const id = interaction.fields.getTextInputValue("id");
    const reason = interaction.fields.getTextInputValue("reason");

    const user = await fetchUser(interaction.client,id);
    const guild = await fetchGuild(interaction.client,id);

    if(!user&&!guild) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "通報できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "無効なユーザーID又はサーバーIDです"
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

    try{
      const guild = await interaction.client.guilds.fetch(config.server);
      const channel = await guild.channels.fetch(config.channels.report);

      const reportId = createId(10);
      const components = [
        new ButtonBuilder()
          .setCustomId(`report_delete_${reportId}`)
          .setStyle(ButtonStyle.Success)
          .setLabel("棄却"),
        new ButtonBuilder()
          .setCustomId(`report_warn_${reportId}`)
          .setStyle(ButtonStyle.Danger)
          .setLabel("警告")
      ]

      if(user){
        if(user.bot) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "通報できませんでした",
              icon_url: "https://cdn.takasumibot.com/images/system/error.png"
            },
            description: "BOTは通報できません"
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

        await db(`INSERT INTO report (id, type, target, title, reason, reporter, time) VALUES("${reportId}","user",${user.id},"${title}","${reason}","${interaction.user.id}",NOW());`);

        if(await mute.getUser(user.id)){
          components.push(
            new ButtonBuilder()
              .setCustomId(`report_unMuteUser_${reportId}`)
              .setStyle(ButtonStyle.Danger)
              .setLabel("ミュートを解除")
          )
        }else{
          components.push(
            new ButtonBuilder()
              .setCustomId(`report_muteUser_${reportId}`)
              .setStyle(ButtonStyle.Danger)
              .setLabel("ミュート")
          )
        }

        const account = await db(`SELECT * FROM account WHERE id = "${user.id}";`);
        if(account[0]){
          if(mute.getIp(account[0].ip)){
            components.push(
              new ButtonBuilder()
                .setCustomId(`report_unMuteIp_${reportId}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel("IPミュートを解除")
            )
          }else{
            components.push(
              new ButtonBuilder()
                .setCustomId(`report_muteIp_${reportId}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel("IPミュート")
            )
          }
        }

        await channel.send({
          embeds:[{
            color: Colors.Green,
            title: title,
            description: `**通報ID**: \`${reportId}\`\n\n**ユーザー**: ${user.displayName}(${user.id})\n\n${reason}`,
            footer:{
              text: `${interaction.user.displayName}(${interaction.user.id})`,
              icon_url: interaction.user.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
            }
          }],
          components: [
            new ActionRowBuilder()
              .addComponents(...components)
          ]
        });
      }else{
        await db(`INSERT INTO report (id, type, target, title, reason, reporter, time) VALUES("${reportId}","user","${guild.id}","${title}","${reason}","${interaction.user.id}",NOW());`);

        if(await mute.getServer(guild.id)){
          components.push(
            new ButtonBuilder()
              .setCustomId(`report_unMuteServer_${reportId}`)
              .setStyle(ButtonStyle.Danger)
              .setLabel("ミュートを解除")
          )
        }else{
          components.push(
            new ButtonBuilder()
              .setCustomId(`report_muteServer_${reportId}`)
              .setStyle(ButtonStyle.Danger)
              .setLabel("ミュート")
          )
        }

        await channel.send({
          embeds:[{
            color: Colors.Green,
            title: title,
            description: `**通報ID**: \`${reportId}\`\n\n**サーバー**: ${guild.name}(${guild.id})\n\n${reason}`,
            footer:{
              text: `${interaction.user.displayName}(${interaction.user.id})`,
              icon_url: interaction.user.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
            }
          }],
          components: [
            new ActionRowBuilder()
              .addComponents(...components)
          ]
        });
      }

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "通報しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "通報ID",
              value: reportId
            },
            {
              name: "用件",
              value: title
            },
            {
              name: "対象",
              value: user ? `${user.displayName}(${user.id})` : `${guild.name}(${guild.id})`
            },
            {
              name: "用件",
              value: reason
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
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "通報できませんでした",
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
        ],
        ephemeral: true
      });
    }
  }
}