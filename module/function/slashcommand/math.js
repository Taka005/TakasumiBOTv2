module.exports = async(interaction)=>{
  const mathjs = require("mathjs");
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "math"){
    const code = interaction.options.getString("code");

    const format = code
      .replace((/[０-９]/gu),(str)=>String.fromCharCode(str.charCodeAt(0) - 65248))
      .replace((/＋/gu),"+")
      .replace((/ー/gu),"-")
      .replace((/[x×]/gu),"*")
      .replace((/÷/gu),"/")
      .replace((/（/gu),"(")
      .replace((/）/gu),")");
      
    try{
      const math = mathjs.create(mathjs.all);
      math.config({
        "number": "BigNumber"
      });
      const res = math.evaluate(format).toString();
      
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "計算しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `**式**\n\`\`\`${format}\`\`\`\n**結果**\n\`\`\`${Number(res)}\`\`\``
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "計算できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          description: "計算式を変えてやり直してください"
        }],
        ephemeral: true
      });
    }
  }
}