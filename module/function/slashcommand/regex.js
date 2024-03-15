module.exports = async(interaction)=>{
  const { Colors, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "regex"){
    const pattern = interaction.options.getString("pattern");
    const flag = interaction.options.getString("flag")||"";
    const match = interaction.options.getString("match");

    try{
      const regex = new RegExp(pattern,flag);

      let matches;
      if(regex.global){
        matches = [...match.matchAll(regex)].map(arr=>arr[0]);
      }else{
        matches = regex.exec(match);
      }

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "検証しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          fields:[
            {
              name: "正規表現",
              value: `/${pattern}/${flag}`
            },
            {
              name: "検証する文字列",
              value: match
            },
            {
              name: "マッチした文字列",
              value: matches?.join("\n")||"マッチしませんでした"
            }
          ]
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "検証できませんでした",
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