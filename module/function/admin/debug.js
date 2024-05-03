module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(interaction.options.getSubcommand() === "debug"){
    const type = interaction.options.getString("type");
    const id = interaction.options.getString("id");
    const channel = interaction.options.getChannel("channel");
    const json = interaction.options.getString("json");

    try{
      if(type === "content"){
        const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "取得しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            },
            description: `\`\`\`json\n${JSON.stringify(msg,null,"  ")}\`\`\``
          }]
        });
      }else if(type === "send"){
        await interaction.reply(JSON.parse(json));
      }else if(type === "edit"){
        const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});
        await msg.edit(JSON.parse(json));

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "編集しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }else if(type === "delete"){
        const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});
        await msg.delete();

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "削除しました",
              icon_url: "https://cdn.takasumibot.com/images/system/success.png"
            }
          }]
        });
      }
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "実行できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        ephemeral: true
      });
    }
  }
}