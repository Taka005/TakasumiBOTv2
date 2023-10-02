const spam = require("../../lib/spam");
const Spam = new spam(10000,true);

module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const graph = require("../../lib/graph");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "analytics"){
    const type = interaction.options.getString("type");

    if(Spam.count(interaction.user.id)) return await interaction.reply({
      embeds:[{
        author:{
          name: "生成できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "生成には10秒間待ってください"
      }],
      ephemeral: true
    });

    await interaction.deferReply();
    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        description: "生成中..."
      }]
    });

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
            label: `${startDate.getFullYear()}/${startDate.getMonth()+1}`,
            value: members.size
          });
       
          startDate.setMonth(startDate.getMonth() + 1);
        }

        data = graph.line(memberCounts,"1年間の月ごとのユーザー参加数","月","人",{
          "x_fontSize": "8"
        });
      }else if(type === "month"){ 
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);

        const memberCounts = [];
        let currentDate = new Date(startDate);

        while(currentDate <= endDate){
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + 1);
      
          const startMembers = (await interaction.guild.members.fetch()).filter(member=>member.joinedAt >= currentDate && member.joinedAt < nextDate);
      
          memberCounts.push({
            label: currentDate.getDate(),
            value: startMembers.size,
          });
      
          currentDate.setDate(currentDate.getDate() + 1);
        }

        data = graph.line(memberCounts,"1ヶ月間の1日ごとのユーザー参加数","日","人",{
          "x_fontSize": "8"
        });
      }else if(type === "status"){
        const members = await interaction.guild.members.fetch();

        const online = members.filter(member=>member.presence?.status === "online");
        const dnd = members.filter(member=>member.presence?.status === "dnd");
        const idle = members.filter(member=>member.presence?.status === "idle");
        const offline = members.filter(member=>member.presence?.status === "offline");
        const none = members.filter(member=>!(member.presence?.status));

        const status = [
          { label: `オンライン: ${online.size}人(${((online.size/members.size)*100).toFixed(1)}%)`, value: online.size, color: "#7fff00" },
          { label: `取り込み中: ${dnd.size}人(${((dnd.size/members.size)*100).toFixed(1)}%)`, value: dnd.size, color: "#ff7f50" },
          { label: `退席中: ${idle.size}人(${((idle.size/members.size)*100).toFixed(1)}%)`, value: idle.size, color: "#ffd700" },
          { label: `オフライン: ${offline.size + none.size}人(${((offline.size + none.size)/members.size*100).toFixed(1)}%)`, value: offline.size + none.size, color: "#d3d3d3" }
        ];

        data = graph.pie(status,"メンバーのステータスの割合");
      }else if(type === "platform"){
        const members = await interaction.guild.members.fetch();

        const web = members.filter(member=>member.presence?.clientStatus?.web);
        const mobile = members.filter(member=>member.presence?.clientStatus?.mobile);
        const desktop = members.filter(member=>member.presence?.clientStatus?.desktop);
        const total = web.size + mobile.size + desktop.size;

        const platform = [
          { label: `ブラウザ: ${web.size}人(${((web.size/total)*100).toFixed(1)}%)`, value: web.size, color: "#ffa500" },
          { label: `モバイル: ${mobile.size}人(${((mobile.size/total)*100).toFixed(1)}%)`, value: mobile.size, color: "#7cfc00" },
          { label: `デスクトップ: ${desktop.size}人(${((desktop.size/total)*100).toFixed(1)}%)`, value: desktop.size, color: "#00bfff" }
        ];

        data = graph.pie(platform,"メンバーの機種の割合");
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
        ],
        ephemeral: true
      });
    }
  }
}