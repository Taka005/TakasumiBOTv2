module.exports = async(interaction)=>{
  const { ActionRowBuilder, StringSelectMenuBuilder, Colors } = require("discord.js");
  const list = require("../../../file/commandlist.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "help"){
    const command = interaction.options.getString("command");

    const types = {
      "info": "情報",
      "manage": "サーバー管理",
      "tool": "ツール",
      "search": "検索",
      "fun": "ネタ",
      "money": "お金",
      "bot": "Bot関連",
      "othor": "その他"
    };

    if(!command){
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: "HELP 情報",
          fields: Object.values(list).filter(command=>command.type === "info").map((command)=>({
            name: `/${command.name}`,
            value: command.description
          }))
        }],
        components:[     
          new ActionRowBuilder()
            .addComponents(
              new StringSelectMenuBuilder()
                .setCustomId(`help_${interaction.user.id}`)
                .setPlaceholder("ページを選択")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                  Object.keys(types).map(type=>({
                    label: types[type],
                    value: type
                  }))
                ))
        ]
      });
    }else{
      if(!list[command]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "コマンドが存在しません",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "`/help`を実行してコマンド一覧を確認してください"
        }],
        ephemeral: true
      });

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: `/${command}の使用方法`,
          description: list[command].description,
          fields:[
            {
              name: "使用例",
              value: list[command].example
            },
            {
              name: "ユーザーの権限",
              value: `\`${list[command].userPermission.join("`,`")}\``
            },
            {
              name: "BOTの権限",
              value:  `\`${list[command].botPermission.join("`,`")}\``
            },
            {
              name: "詳細情報",
              value: list[command].note
            }
          ]
        }]
      });
    }
  }
}