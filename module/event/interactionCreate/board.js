module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  const random = require("../../lib/random");
  const board = require("../../lib/board");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("board")){
    const pos = interaction.customId.split("_")[1];

    if(interaction.message.content.match(/\d{18,19}/g)[0] !== interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "更新できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このゲームは他の人が使用しています"
      }],
      ephemeral: true
    });
      
    const panel = [
      interaction.message.components[0].components[0].label,
      interaction.message.components[0].components[1].label,
      interaction.message.components[0].components[2].label,
      interaction.message.components[1].components[0].label,
      interaction.message.components[1].components[1].label,
      interaction.message.components[1].components[2].label,
      interaction.message.components[2].components[0].label,
      interaction.message.components[2].components[1].label,
      interaction.message.components[2].components[2].label,
    ];

    let newPanel = [...panel];
    newPanel[pos] = "0";

    if(panel.every(label=>label === "-")){
      newPanel[random(board.near[pos])] = "x";
    }else{
      const judge = board.win.map((array)=>{
        const data = array.map(pos=>newPanel[pos]);
        if(data.every(res=>res === "0")){
          return "勝利";
        }else if(data.every(res=>res === "x")){
          return "敗北";
        }
      }).filter(select=>select!==undefined);
      if(judge){
        console.log("WIN of No")
      }
      const reach = board.reach.map((array)=>{
        if(array.map(pos=>newPanel[pos]).every(res=>res === "0")) return true;
      }).filter(select=>select!==undefined);
      if(reach){
        console.log(reach);
      }
    }
    const button = newPanel.map((data,i)=>{
      if(data === "0"){
        return new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("0")
          .setCustomId(`board_${i}`)
          .setDisabled(true)
      }else if(data === "x"){
        return new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("x")
          .setCustomId(`board_${i}`)
          .setDisabled(true)
      }else{
        return new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel("-")
          .setCustomId(`board_${i}`)
      }
    });

    await interaction.message.edit({
      content: `<@${interaction.user.id}>`,
      embeds:[{
        color: Colors.Green,
        title: "⭕️❌ゲーム"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            button[0],
            button[1],
            button[2]
          ),
        new ActionRowBuilder()
          .addComponents(
            button[3],
            button[4],
            button[5]
          ),
        new ActionRowBuilder()
          .addComponents(
            button[6],
            button[7],
            button[8]
          )
      ]
    })
    .then(async()=>{
      await interaction.deferUpdate({});
    })
    .catch(async(err)=>{
      await interaction.reply({
        embeds:[{
          author:{
            name: "更新できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "BOTの権限が不足しています"
        }],
        ephemeral: true
      });
    });    
  }
}