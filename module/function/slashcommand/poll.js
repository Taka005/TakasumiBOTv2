module.exports = async(interaction)=>{
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "poll"){
    const title = interaction.options.getString("title");
    const select_1 = interaction.options.getString("select_1");
    const select_2 = interaction.options.getString("select_2");
    const select_3 = interaction.options.getString("select_3");
    const select_4 = interaction.options.getString("select_4");
    const select_5 = interaction.options.getString("select_5");
    const select_6 = interaction.options.getString("select_6");
    const select_7 = interaction.options.getString("select_7");
    const select_8 = interaction.options.getString("select_8");

    const emojis = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭"];
    const selects = [select_1,select_2,select_3,select_4,select_5,select_6,select_7,select_8]
      .filter(select=>select!==null)

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has("ADD_REACTIONS")) return await interaction.reply({
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
            value: "```リアクションの追加```"
          }
        ]
      }],
      ephemeral: true
    });

    const msg = await interaction.reply({
      embeds:[{
        title: title,          
        color: interaction.member.displayHexColor,
        description: selects.map((c,i)=>`${emojis[i]}${c}`).join("\n"),
        timestamp: new Date()
      }],
      fetchReply: true
    });

    emojis.slice(0,selects.length)
      .forEach(emoji=>{
        msg.react(emoji)
          .catch(()=>{})
      });
  }
}