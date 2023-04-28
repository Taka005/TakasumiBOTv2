module.exports = async(interaction)=>{
  const list = require("../../file/commandlist.json");
  const { MessageButton, MessageActionRow } = require("discord.js");
  if(!interaction.isCommand()) return;
  if(interaction.commandName === "help"){
    const command = interaction.options.getString("command");

    if(!command){
      await interaction.reply({
        embeds:[{
          title: "HELP 便利系",
          color: "GREEN",
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
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("前")
                .setCustomId(`page_5_${interaction.user.id}`))
            .addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("1ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("次")
                .setCustomId(`page_2_${interaction.user.id}`))
        ]
      });
    }else{
      if(!list[command]) return await interaction.reply({
        embeds:[{
          author:{
            name: "コマンドが存在しません",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "`/help`を実行してコマンド一覧を確認してください"
        }],
        ephemeral: true
      });

      await interaction.reply({
        embeds:[{
          title: `/${command}の使用方法`,
          color: "GREEN",
          description: list[command].description,
          fields:[
            {
              name: "使用例",
              value: list[command].example
            },
            {
              name: "権限",
              value: `\`${list[command].permission.join("`,`")}\``
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