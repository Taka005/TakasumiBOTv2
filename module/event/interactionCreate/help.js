module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const list = require("../../../file/commandlist");
  if(!interaction.isStringSelectMenu()) return;
  if(interaction.customId.startsWith("help_")){
    const data = interaction.customId.split("_");
    const type = interaction.values[0];

    const types = {
      "info": "情報",
      "server": "サーバー関連",
      "manage": "管理",
      "tool": "ツール",
      "search": "検索",
      "fun": "ネタ",
      "money": "お金",
      "board": "サーバー掲示板",
      "bot": "Bot関連",
      "othor": "その他",
      "contextmenu": "コンテキストメニュー"
    };

    if(data[1] !== interaction.user.id) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "ページを更新できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドは別の人が操作しています"
      }],
      ephemeral: true
    });

    try{
      await interaction.message.edit({
        embeds:[{
          color: Colors.Green,
          title: `HELP ${types[type]}`,
          fields: Object.values(list).filter(command=>command.type === type).map((command)=>({
            name: command.name,
            value: command.description
          }))
        }]
      });

      await interaction.deferUpdate({});
    }catch(error){
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "ページを更新できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "BOTの権限が不足しています",
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