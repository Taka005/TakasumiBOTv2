module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "invites"){
    const user = interaction.options.getUser("user");

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageGuild)) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```サーバーの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      if(user){
        const invites = (await interaction.guild.invites.fetch()).toJSON()
          .filter(invite=>invite.inviterId===user.id);

        if(!invites[0]) return await interaction.reply({
          embeds:[{
            author:{
              name: "招待を取得できません",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
            description: "指定したユーザーの招待が見つかりませんでした"
          }],
          ephemeral: true
        });

        await interaction.reply({
          embeds:[{
            author:{
              name: `${user.tag}の招待一覧`,
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: "GREEN",
            description: invites.map((invite)=>`\`${invite.code}\` ${invite.uses}回`).join("\n")
          }]
        });
      }else{
        const invites = (await interaction.guild.invites.fetch()).toJSON()
          .filter(invite=>invite.inviterId);

        await interaction.reply({
          embeds:[{
            author:{
              name: "サーバーの招待一覧",
              icon_url: "https://cdn.taka.ml/images/system/success.png"
            },
            color: "GREEN",
            description: invites.map((invite)=>`\`${invite.code}\` ${invite.uses}回(<@${invite.inviterId}>)`).join("\n")
          }]
        });
      }
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "招待を取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
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
                .setStyle("LINK"))
        ],
        ephemeral: true
      });
    }
  }
}