module.exports = async(interaction)=>{
  const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "panel"){
    const title = interaction.options.getString("title")||"役職パネル";
    const role_1 = interaction.options.getRole("role_1");
    const role_2 = interaction.options.getRole("role_2");
    const role_3 = interaction.options.getRole("role_3");
    const role_4 = interaction.options.getRole("role_4");
    const role_5 = interaction.options.getRole("role_5");
    const role_6 = interaction.options.getRole("role_6");
    const role_7 = interaction.options.getRole("role_7");
    const role_8 = interaction.options.getRole("role_8");

    const emojis = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭"];
    const selects = [role_1,role_2,role_3,role_4,role_5,role_6,role_7,role_8]
      .filter(role=>role!==null)

    if(!interaction.member.permissions.has("MANAGE_ROLES")) return await interaction.reply({
      embeds:[{
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```ロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("VIEW_CHANNEL")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("SEND_MESSAGES")||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has("MANAGE_ROLES")
    ) return await interaction.reply({
      embeds:[{
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nメッセージの送信\nロールの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    try{
      await interaction.channel.send({
        embeds:[{
          title: title,          
          color: "GREEN",
          description: selects.map((c,i)=>`${emojis[i]}<@&${c.id}>`).join("\n")
        }],
        components:[     
          new MessageActionRow()
            .addComponents(
              new MessageSelectMenu()
                .setCustomId("role")
                .setPlaceholder("ロールが選択されていません")
                .setMinValues(0)
                .setMaxValues(selects.length)
                .addOptions(
                  selects.map((c,i)=>({
                    label: `@${c.name}`,
                    value: c.id,
                    emoji:{
                      name: emojis[i]
                    }
                  }))
                ))
        ]
      });

      await interaction.deferReply()
        .then(()=>interaction.deleteReply())
    }catch(error){
      await interaction.reply({
        embeds:[{
          author:{
            name: "作成できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "同じロールが選択されているか、BOTの権限が不足しています",
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ]
        }],
        components:[
          new MessageActionRow()
            .addComponents( 
              new MessageButton()
                .setLabel("サポートサーバー")
                .setURL("https://discord.gg/NEesRdGQwD")
                .setStyle("LINK"))
        ],
        ephemeral: true
      });
    }
  }
}