module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  const list = require("../../../file/commandlist.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "help"){
    const command = interaction.options.getString("command");

    if(!command){
      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          title: "HELP 便利系",
          fields:[
            {
              name: "/poll",
              value: "アンケートを作成することができます\n最大で選択肢は8個までです"
            },
            {
              name: "/global",
              value: "色々なサーバーと繋がるグローバルチャットを有効、無効にします\n[利用規約](https://gc.taka.ml/)を読んでから使用してください"
            },
            {
              name: "/about",
              value: "BOTについての情報や、関連リンクを表示します"
            },
            {
              name: "/afk",
              value: "AFKを設定します(留守電の機能です)"
            },
            {
              name: "/follow",
              value: "BOTのアナウンスチャンネルを追加します"
            },
            {
              name: "/hiroyuki",
              value: "ひろゆきを召喚します"
            },
            {
              name: "/top",
              value: "実行したチャンネルの1番最初のメッセージを表示します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_5_${interaction.user.id}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("1ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_2_${interaction.user.id}`))
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