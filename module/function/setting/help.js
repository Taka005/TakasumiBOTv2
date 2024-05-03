module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(interaction.options.getSubcommand() === "help"){
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        title: "HELP 設定",
        description: "設定の変更には`管理者`の権限が必要です",
        fields:[
          {
            name: "/setting stats",
            value: "サーバーの統計情報の収集の有効・無効を切り替えます"
          },
          {
            name: "/setting bump",
            value: "BUMPの時間に通知するロールを設定します"
          },
          {
            name: "/setting dissoku",
            value: "Dissoku UPの時間に通知するロールを設定します"
          },
          {
            name: "/setting up",
            value: "TakasumiBOTのUPの時間に通知するロールを設定します"
          },
          {
            name: "/setting join",
            value: "実行したチャンネルに参加メッセージの設定をします\n\n利用可能な変数\n[User] ユーザーメンション\n[UserName] ユーザーの名前\n[UserDisplayName] ユーザーの表示名\n[UserID] ユーザーID\n[ServerName] サーバーの名前\n[ServerID] サーバーID\n[Count] メンバー数"
          },
          {
            name: "/setting leave",
            value: "実行したチャンネルに退出メッセージの設定をします\n`/setting join`と同じ変数を利用できます"
          },
          {
            name: "/setting ignore",
            value: "メッセージ展開、Bump通知、Dissoku通知、UP通知の無効・有効を切り替えます\n有効にすると各通知機能の設定情報は削除されます"
          },
          {
            name: "/setting info",
            value: "データベースの設定状況を表示します"
          },
          {
            name: "/setting delete",
            value: "サーバーの設定情報を**全て**削除します\n**この操作は元に戻せません**"
          }
        ]
      }]
    });
  }
}