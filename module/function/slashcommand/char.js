module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const iconv = require("iconv-lite");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "char"){
    const type = interaction.options.getString("type");
    const text = interaction.options.getString("text");

    try{
      if(type === "encode"){
        const buffer = iconv.encode(text,"UTF-8");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "変換しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `\`\`\`${iconv.decode(buffer,"Shift_JIS")}\`\`\``
          }]
        });
      }else{
        const buffer = iconv.encode(text,"Shift_JIS");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "復元しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `\`\`\`${iconv.decode(buffer,"UTF-8")}\`\`\``
          }]
        });
      }
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "変換できませんでした",
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
        ]
      });
    }
  }
}