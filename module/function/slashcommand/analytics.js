module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const graph = require("../../lib/graph");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "analytics"){
    const type = interaction.options.getString("type");

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
        const time = [];
        const count = [];
        
        for(let i = 0; i < 12; i++){
          const nextMonth = new Date(startDate);
          nextMonth.setMonth(startDate.getMonth() + 1);
       
          const members = (await interaction.guild.members.fetch()).filter(member=>member.joinedAt >= startDate && member.joinedAt < nextMonth);
       
          time.push(`${startDate.getFullYear()}/${startDate.getMonth()+1}`);
          count.push(members.size);

          startDate.setMonth(startDate.getMonth() + 1);
        }

        data = await fetch("https://localhost:4000/line",{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "x": time,
            "y": count,
            "title": "1年間の月ごとのユーザー参加数",
            "xLabel": "月",
            "yLabel": "人"
          })
        }).then(res=>res.blob());
      }else if(type === "month"){ 
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1);

        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 1);

        const memberCounts = [];

        while(startDate <= endDate){
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + 1);
      
          const members = (await interaction.guild.members.fetch()).filter(member=>member.joinedAt >= startDate && member.joinedAt < nextDate);
      
          memberCounts.push({
            label: startDate.getDate(),
            value: members.size,
          });
      
          startDate.setDate(startDate.getDate() + 1);
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