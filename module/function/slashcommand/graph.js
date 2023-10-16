module.exports = async(interaction)=>{
  const { Colors, AttachmentBuilder } = require("discord.js");
  const fetch = require("node-fetch");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "graph"){
    const formulas = [
      interaction.options.getString("formula_1"),
      interaction.options.getString("formula_2"),
      interaction.options.getString("formula_3")
    ]
      .filter(formula=>formula!==null)
      .map(formula=>
        formula
          .replace((/[０-９]/gu),(str)=>String.fromCharCode(str.charCodeAt(0) - 65248))
          .replace((/＋/gu),"+")
          .replace((/ー/gu),"-")
          .replace((/[x×]/gu),"*")
          .replace((/÷/gu),"/")
          .replace((/（/gu),"(")
          .replace((/）/gu),")")
      ).join(",");
  
    await interaction.deferReply();
    try{
      const image = await fetch(`http://localhost:4000/?formula=${formulas}`)
        .then(res=>res.blob());
  
        await interaction.editReply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "生成しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            image:{
              url: "attachment://graph.png"
            }
          }],
          files:[
            new AttachmentBuilder()
              .setFile(image.stream())
              .setName("graph.png")
          ]
        });
    }catch{
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "数式を変えてやり直してください"
        }]
      });
    }
  }
}