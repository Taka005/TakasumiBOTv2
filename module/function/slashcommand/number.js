module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "number"){
    const source = interaction.options.getString("source");
    const target = interaction.options.getString("target");
    const number = interaction.options.getString("number");

    if(isNaN(number)) return await interaction.editReply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "変換できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "変換する値は数字を指定してください"
      }]
    });
  
    try{
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