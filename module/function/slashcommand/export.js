module.exports = async(interaction)=>{
  const { AttachmentBuilder ,ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "export"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
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
      const data = Buffer.from(JSON.stringify({
        "guild":{
          "name": interaction.guild.name,
          "id": interaction.guild.id,
          "count": interaction.guild.memberCount,
          "icon": interaction.guild.iconURL(),
          "createAt": new Date(interaction.guild.createdTimestamp).toLocaleString(),
          "invites": (await interaction.guild.invites.fetch()).map(invite=>({
            "url": invite.url,
            "code": invite.code,
            "createAt": new Date(invite.createdTimestamp).toLocaleString()
          })),
          "channels": interaction.guild.channels.cache.map(channel=>({
            "name": channel.name,
            "id": channel.id,
            "topic": channel.topic,
            "type": channel.type,
            "createAt": new Date(channel.createdTimestamp).toLocaleString()
          })),
          "members": interaction.guild.members.cache.map(member=>({
            "name": member.user.tag,
            "id": member.user.id,
            "color": member.displayHexColor,
            "avatar": member.user.avatarURL(),
            "joinAt": new Date(member.joinedTimestamp).toLocaleString(),
            "createAt": new Date(member.user.createdTimestamp).toLocaleString()
          })),
          "roles": interaction.guild.roles.cache.map(role=>({
            "name": role.name,
            "id": role.id,
            "color": role.hexColor,
            "createAt": new Date(role.createdTimestamp).toLocaleString()
          }))
        }
      },null,"  "),"UTF-8");

      await interaction.reply({
        files:[
          new AttachmentBuilder()
            .setFile(data) 
            .setName("SERVER_FILE.json")
        ] 
      });
    }catch(error){
      await interaction.reply({ 
        embeds:[{
          color: Colors.Red,
          author:{
            name: "出力に失敗しました",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
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
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle(ButtonStyle.Link))
        ],
        ephemeral: true 
      });
    }
  }
}