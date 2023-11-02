module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "number"){
    const source = interaction.options.getString("source");
    const target = interaction.options.getString("target");
    const number = interaction.options.getString("number");

    if(isNaN(number)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "変換できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "変換する値は数字を指定してください"
      }],
      ephemeral: true
    });

    const data = parseInt(number,Number(source)).toString(Number(target));

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${source}進数から${target}進数に変換しました`,
          icon_url: "https://cdn.taka.cf/images/system/success.png"
        },
        description: `\`\`\`${data}\`\`\``
      }]
    });
  }
}