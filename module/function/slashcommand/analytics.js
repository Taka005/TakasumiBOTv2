module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder, ChannelType, Colors } = require("discord.js");
  const fetch = require("node-fetch");
  const db = require("../../lib/db");
  const config = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "analytics"){
    const type = interaction.options.getString("type");

    await interaction.deferReply();
    try{
      let data;
      if(type === "year"){
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth()-12);
        const time = [];
        const count = [];

        const members = await interaction.guild.members.fetch();

        for(let i = 0;i < 12;i++){
          const nextMonth = new Date(startDate);
          nextMonth.setMonth(startDate.getMonth()+1,0);

          time.push(`${startDate.getMonth()+1}月`);
          count.push(members.filter(member=>member.joinedAt >= startDate&&member.joinedAt < nextMonth).size);

          startDate.setMonth(startDate.getMonth()+1,1);
        }

        data = await fetch(`${config.api.graph}/line`,{
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
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth()-1);

        const time = [];
        const count = [];

        const members = await interaction.guild.members.fetch();

        for(let i = 0;i < 30;i++){
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate()+1);

          time.push(`${startDate.getDate()}日`);
          count.push(members.filter(member=>member.joinedAt >= startDate&&member.joinedAt < nextDate).size);

          startDate.setDate(startDate.getDate()+1);
        }

        data = await fetch(`${config.api.graph}/line`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "x": time,
            "y": count,
            "title": "1ヶ月間の1日ごとのユーザー参加数",
            "xLabel": "日",
            "yLabel": "人",
            "xFont": "5"
          })
        }).then(res=>res.blob());
      }else if(type === "status"){
        const members = await interaction.guild.members.fetch();

        const online = members.filter(member=>member.presence?.status === "online");
        const dnd = members.filter(member=>member.presence?.status === "dnd");
        const idle = members.filter(member=>member.presence?.status === "idle");
        const offline = members.filter(member=>member.presence?.status === "offline"||!member.presence?.status);

        data = await fetch(`${config.api.graph}/pie`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "data": [online.size,dnd.size,idle.size,offline.size],
            "label": [`オンライン(${online.size}人)`,`取り込み中(${dnd.size}人)`,`退席中(${idle.size}人)`,`オフライン(${offline.size}人)`],
            "color": ["#7fff00","#ff7f50","#ffd700","#d3d3d3"],
            "title": "メンバーのステータスの割合"
          })
        }).then(res=>res.blob());
      }else if(type === "platform"){
        const members = await interaction.guild.members.fetch();

        const web = members.filter(member=>member.presence?.clientStatus?.web);
        const mobile = members.filter(member=>member.presence?.clientStatus?.mobile);
        const desktop = members.filter(member=>member.presence?.clientStatus?.desktop);

        data = await fetch(`${config.api.graph}/pie`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "data": [web.size,mobile.size,desktop.size],
            "label": [`ブラウザ(${web.size}人)`,`モバイル(${mobile.size}人)`,`デスクトップ(${desktop.size}人)`],
            "color": ["#ffa500","#7cfc00","#00bfff"],
            "title": "メンバーの機種の割合"
          })
        }).then(res=>res.blob());
      }else if(type === "bot"){
        const members = await interaction.guild.members.fetch();

        const bot = members.filter(member=>member.user.bot);

        data = await fetch(`${config.api.graph}/pie`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "data": [bot.size,interaction.guild.memberCount - bot.size],
            "label": [`BOT(${bot.size}人)`,`ユーザー(${interaction.guild.memberCount - bot.size}人)`],
            "color": ["#808080","#00bfff"],
            "title": "ユーザーとBOTの割合"
          })
        }).then(res=>res.blob());
      }else if(type === "channel"){
        const channels = await interaction.guild.channels.fetch();

        const text = channels.filter(ch=>ch.type===ChannelType.GuildText);
        const voice = channels.filter(ch=>ch.type===ChannelType.GuildVoice);
        const category = channels.filter(ch=>ch.type===ChannelType.GuildCategory);

        data = await fetch(`${config.api.graph}/pie`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "data": [text.size,voice.size,category.size],
            "label": [`テキスト(${text.size}個)`,`ボイス(${voice.size}個)`,`カテゴリー(${category.size}個)`],
            "color": ["#7fff00","#00bfff","#ffa500"],
            "title": "チャンネルの種類の割合"
          })
        }).then(res=>res.blob());
      }else if(type === "account"){
        const members = await interaction.guild.members.fetch()
        const accounts = await db(`SELECT * FROM account;`);

        const register = members
          .filter(member=>!member.user.bot)
          .filter(member=>accounts.find(account=>account.id === member.id))

        const user = members.filter(member=>!member.user.bot);

        data = await fetch(`${config.api.graph}/pie`,{
          "method": "POST",
          "headers":{
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({
            "data": [register.size,user.size - register.size],
            "label": [`登録済み(${register.size}人)`,`未登録(${user.size - register.size}人)`],
            "color": ["#7fff00","#808080"],
            "title": "TakasumiBOT Accountの登録割合"
          })
        }).then(res=>res.blob());
      }

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "生成しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          },
          image:{
            url: "attachment://analytics.png"
          }
        }],
        files:[
          new AttachmentBuilder()
            .setFile(data.stream())
            .setName("analytics.png")
        ]
      });
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "生成できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
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