module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId === "english"){
    
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        thumbnail:{
          url: "https://cdn.taka.cf/images/bot.png"
        },
        title: "Thanks for adding the Bot!",
        description: "My name is TakasumiBOT\nIt is a powerful BOT with useful functions!\n\nRun `/help` to view the help for the command",
        timestamp: new Date()
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("Support Server")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
      ],
      ephemeral: true
    });
  }
}