module.exports = async(interaction)=>{
  const { PermissionFlagsBits, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "poll"){
    const title = interaction.options.getString("title");

    const selects = [
      interaction.options.getString("select_1"),
      interaction.options.getString("select_2"),
      interaction.options.getString("select_3"),
      interaction.options.getString("select_4"),
      interaction.options.getString("select_5"),
      interaction.options.getString("select_6"),
      interaction.options.getString("select_7"),
      interaction.options.getString("select_8")
    ].filter(select=>select!==null);

    const emojis = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭"];

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.AddReactions)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```リアクションの追加```"
          }
        ]
      }],
      ephemeral: true
    });

    const msg = await interaction.reply({
      embeds:[{
        title: title,          
        color: Colors.Green,
        description: selects.map((c,i)=>`${emojis[i]}${c}`).join("\n"),
        timestamp: new Date()
      }],
      fetchReply: true
    });

    emojis.slice(0,selects.length).forEach(emoji=>{
      msg.react(emoji)
        .catch(()=>{});
    });
  }
}