module.exports = async(interaction)=>{
  const { AttachmentBuilder ,ButtonBuilder, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "export"){

    if(!interaction.member.permissions.has("ADMINISTRATOR")) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```管理者```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      const data = new Buffer.from(JSON.stringify({
        "guild":{
          "name": interaction.guild.name,
          "id": interaction.guild.id,
          "count": interaction.guild.memberCount,
          "icon": interaction.guild.iconURL(),
          "time": new Date(interaction.guild.createdTimestamp).toLocaleString(),
          "invites": (await interaction.guild.invites.fetch()).map(invite=>({
            "url": invite.url,
            "code": invite.code
          })),
          "channels": interaction.guild.channels.cache.map(channel=>({
            "name": channel.name,
            "id": channel.id,
            "topic": channel.topic,
            "type": channel.type,
            "time": new Date(channel.createdTimestamp).toLocaleString()
          })),
          "members": interaction.guild.members.cache.map(member=>({
            "name": member.user.tag,
            "id": member.user.id,
            "color": member.displayHexColor,
            "avatar": member.user.avatarURL(),
            "join": new Date(member.joinedTimestamp).toLocaleString(),
            "time": new Date(member.user.createdTimestamp).toLocaleString()
          })),
          "roles": interaction.guild.roles.cache.map(role=>({
            "name": role.name,
            "id": role.id,
            "color": role.hexColor,
            "time": new Date(role.createdTimestamp).toLocaleString()
          }))
        }
      },null,"  "),"UTF-8");

      await interaction.reply({
        content:"サーバーのデータをJSON形式に出力しました",
        files:[
          new AttachmentBuilder()
            .setDescription("データは慎重に扱ってください") 
            .setFile(data) 
            .setName("SERVER_JSON_FILE.json")
        ] 
      });
    }catch(error){
      await interaction.reply({ 
        embeds:[{
          author:{
            name: "出力に失敗しました",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "BOTの権限が不足しているため正しく出力できません",
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