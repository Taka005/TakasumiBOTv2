module.exports = async(interaction)=>{
  const { Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const fetchUser = require("../../lib/fetchUser");
  const fetchGuild = require("../../lib/fetchGuild");
  const createId = require("../../lib/createId");
  const db = require("../../lib/db");
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
      const message = user ? `ユーザー: ${user.displayName}(${user})` : `サーバー: ${guild.name}(${guild.id})`;

      await db(`INSERT INTO report (id, type, target, title, reason, reporter time) VALUES("${reportId}","${user ? "user" : "server" }",${user ? user.id : guild.id},"${title}","${reason}","${interaction.user.id}",NOW());`);

      await channel.send({
        embeds:[{
          color: Colors.Green,
          title: title,
          description: `通報ID: ${reportId}\n\n${message}\n\n${reason}`,
          footer:{
            text: `${interaction.user.displayName}(${interaction.user.id})`,
            icon_url: interaction.user.avatarURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
          },
        }]
      });

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
              name: "対象のID",
              value: id
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