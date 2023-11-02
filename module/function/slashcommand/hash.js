module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const crypto = require("crypto");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "hash"){
    const text = interaction.options.getString("text");
    const type = interaction.options.getString("type");

    try{
      const hash = crypto.createHash(type);
      hash.update(text);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "ハッシュを生成しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          description: `${hash.digest("hex")}`
        }]
      });
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ハッシュを生成できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        ephemeral: true,
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle(ButtonStyle.Link))
        ]
      });
    }
  }
}