module.exports = async(interaction)=>{
  const { AttachmentBuilder, PermissionFlagsBits, Colors } = require("discord.js");
  const fetchMessage = require("../../lib/fetchMessage");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "log"){
    const format = interaction.options.getString("format");
    const limit = interaction.options.getInteger("limit");

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ReadMessageHistory)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージ履歴の閲覧```"
          }
        ]
      }],
      ephemeral: true
    });

    if(limit < 1||limit > 100) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "取得するメッセージの数は`1`以上`100`以下にする必要があります"
      }],
      ephemeral: true
    });

    const messages = await fetchMessage(interaction.channel,{limit: limit});
    if(!messages) return await interaction.reply({
      embeds:[{
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        color: Colors.Red,
        description: "BOTの権限が不足しています"
      }],
      ephemeral: true
    });

    let data;
    if(format === "json"){
      data = JSON.stringify(messages.map(message=>({
        id: message.id,
        user:{
          id: message.author.id,
          name: message.author.tag,
          bot: message.author.bot
        },
        content: message.content
      })),null,"  ");
    }else if(format === "txt"){
      data = messages.map(message=>`${message.author.bot?"[BOT]":""}${message.author.tag}(${message.author.id})\n${message.content||"[内容がありません]"}`).join("\n\n")
    }

    await interaction.reply({
      files:[
        new AttachmentBuilder()
          .setFile(Buffer.from(data))
          .setName(`LOG.${format}`)
      ]
    });
  }
}