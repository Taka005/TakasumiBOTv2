module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "faq"){

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        title: "FAQ",
        description: "よくある質問一覧です。他の質問がある場合は[サポートサーバー](https://discord.gg/NEesRdGQwD)にてよろしくお願いします",
        fields:[
          {
            name: "何で開発しているの？",
            value: "Node.js(JavaScript)で構築しています。開発環境はVScodeです"
          },
          {
            name: "どんなサービスを使って運営しているの？",
            value: "Github、CloudFlare、RPS Internet Group等を使用し運営しています"
          },
          {
            name: "TakasumiBOT Authとは?",
            value: "TakasumiBOTの認証に用いられるWeb認証システムです"
          },
          {
            name: "BOTや、その他サービスは何で動かしているの？",
            value: "セキュリティの為公表することができません"
          },
          {
            name: "BOTの機能はどうやって使うの？",
            value: "全コマンドはスラッシュコマンドに対応しています。詳しい使い方は[ここから](https://takasumibot.taka.ml/)"
          },
          {
            name: "制作依頼は受け付けていますか？",
            value: "制作依頼は一部を除いて受け付けておりません。気が向いたらOKするかも??"
          },
          {
            name: "どこでBOT等のお知らせを受け取れますか？",
            value: "サポートサーバーまたは、`/follow`コマンドでアナウンスチャンネルを追加することで受け取りが可能です"
          }
        ]
      }]
    });
  }
}