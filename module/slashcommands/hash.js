module.exports = async(interaction)=>{
  const { MessageButton, MessageActionRow } = require("discord.js");
  const crypto = require("crypto");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "hash"){
    const text = interaction.options.getString("text");
    const type = interaction.options.getString("type");

    try{
      const hash = crypto.createHash(type);
      hash.update(text);

      await interaction.reply({
        embeds:[{
          author:{
            name: "ハッシュを生成しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `${hash.digest("hex")}`,
          color: "GREEN"
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "ハッシュを生成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }], 
        ephemeral: true,   
        components:[
          new MessageActionRow()
            .addComponents( 
              new MessageButton()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle("LINK"))
        ]
      });
    }
  }
}