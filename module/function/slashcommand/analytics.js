module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const graph = require("../../lib/graph");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "analytics"){
    const type = interaction.options.getString("type");

    await interaction.deferReply();
    try{
      let data;
      if(type === "year"){
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);
        const memberCounts = [];
        for(let i = 0; i < 12; i++){
          const nextMonth = new Date(startDate);
          nextMonth.setMonth(startDate.getMonth() + 1);
       
          const members = (await interaction.guild.members.fetch()).filter(member=>member.joinedAt >= startDate && member.joinedAt < nextMonth);
       
          memberCounts.push({
            label: startDate.getMonth()+1,
            value: members.size
          });
       
          startDate.setMonth(startDate.getMonth() + 1);
        }

        data = graph(memberCounts,"月ごとのユーザー参加数","月","人");
      }else if(type === "month"){ 
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);

        const memberCounts = [];
        let nextDate = new Date(startDate);

        while(nextDate <= endDate){
          const nextDate = new Date(nextDate);
          nextDate.setDate(nextDate.getDate() + 1);

          const startMembers = (await interaction.guild.members.fetch()).filter(member=>member.joinedAt >= nextDate && member.joinedAt < nextDate);

          memberCounts.push({
            label: `${nextDate.getMonth()+1}/${nextDate.getDate()}`,
            value: startMembers.size,
          });

          nextDate.setDate(nextDate.getDate() + 1);
        }

        data = graph(memberCounts,"1ヶ月間の1日ごとのユーザー参加数","日","人");
      }

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "生成しました",
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          image:{
            url: "attachment://analytics.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(data)
            .setName("analytics.png")
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error.stack}\`\`\``
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
        ],
        ephemeral: true
      });
    }
  }
}