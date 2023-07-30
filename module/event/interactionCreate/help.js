module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const list = require("../../../file/commandlist");
  if(!interaction.isStringSelectMenu()) return;
  if(interaction.customId.startsWith("help_")){
    const id = interaction.customId.split("_");
    const type = interaction.values[0];

    const types = {
      "info": "情報",
      "manage": "サーバー管理",
      "tool": "ツール",
      "search": "検索",
      "fun": "ネタ",
      "money": "お金",
      "bot": "Bot関連",
      "othor": "その他",
      "contextmenu": "コンテキストメニュー"
    };

    if(id[1] !== interaction.user.id) return await interaction.reply({
      embeds:[{
        author:{
          name: "ページを更新できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドは別の人が操作しています"
      }],
      ephemeral: true
    });

    await interaction.message.edit({
      embeds:[{
        title: `HELP ${types[type]}`,
        color: Colors.Green,
        fields: Object.values(list).filter(command=>command.type === type).map((command)=>({
          name: `${command.name}`,
          value: command.description
        }))
      }]
    })
    .then(async()=>{
      await interaction.deferUpdate({});
    })
    .catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          author:{
            name: "ページを更新できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          color: Colors.Red,
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
    });
  }
}