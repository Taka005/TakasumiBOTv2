module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ticket"){
    const description = interaction.options.getString("description")||"チケットの発行は下のボタンを押してください";

    if(
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)||
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)
    ) return await interaction.reply({
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
            value: "```メッセージの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nチャンネル管理\nメッセージの送信```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      await interaction.channel.send({
        embeds:[{
          color: Colors.Green,
          title: "チケット",
          description: description
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("ticket")
                .setStyle(ButtonStyle.Primary)
                .setLabel("作成"))
        ]
      });

      if(!interaction.guild.channels.cache.find(ch=>ch.name === "ticket")){
        await interaction.guild.channels.create({
          name: "ticket",
          type: ChannelType.GuildCategory
        });
      }

      await interaction.deferReply()
        .then(()=>interaction.deleteReply());
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "チケットが作成出来ませんでした",
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