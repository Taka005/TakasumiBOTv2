module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(interaction.options.getSubcommand() === "info"){
    const bump = await db(`SELECT * FROM bump WHERE id = ${interaction.guild.id};`);
    const dissoku = await db(`SELECT * FROM dissoku WHERE id = ${interaction.guild.id};`);
    const global = await db(`SELECT * FROM global WHERE server = ${interaction.guild.id};`);
    const hiroyuki = await db(`SELECT * FROM hiroyuki WHERE server = ${interaction.guild.id};`);
    const ignore = await db(`SELECT * FROM \`ignore\` WHERE id = ${interaction.guild.id};`);
    const join = await db(`SELECT * FROM \`join\` WHERE server = ${interaction.guild.id};`);
    const leave = await db(`SELECT * FROM \`leave\` WHERE server = ${interaction.guild.id};`);
    const pin = await db(`SELECT * FROM pin WHERE server = ${interaction.guild.id};`);
    const announce = await db(`SELECT * FROM announce WHERE server = ${interaction.guild.id};`);
    const server = await db(`SELECT * FROM server WHERE id = ${interaction.guild.id};`);
    const stats = await db(`SELECT * FROM stats WHERE id = ${interaction.guild.id};`);
    const up = await db(`SELECT * FROM up WHERE id = ${interaction.guild.id};`);

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: "データベース設定状況",
          icon_url: "https://cdn.takasumibot.com/images/system/success.png"
        },
        fields:[
          {
            name: "統計情報の収集",
            value: stats[0] ? "設定済み":"未設定"
          },
          {
            name: "Bump通知",
            value: bump[0] ? "設定済み":"未設定"
          },
          {
            name: "Dissoku通知",
            value: dissoku[0] ? "設定済み":"未設定"
          },
          {
            name: "TakasumiBOT UP通知",
            value: up[0] ? "設定済み":"未設定"
          },
          {
            name: "サーバー掲示板",
            value: server[0] ? "登録済み":"未登録"
          },
          {
            name: "グローバルチャット",
            value: global[0] ? "登録済み":"未登録"
          },
          {
            name: "ひろゆき",
            value: hiroyuki[0] ? "登録済み":"未登録"
          },
          {
            name: "メッセージ無視",
            value: ignore[0] ? `Bump通知: ${ignore[0].bump?"無効":"有効"}\nDissoku通知: ${ignore[0].dissoku?"無効":"有効"}\nUP通知: ${ignore[0].up?"無効":"有効"}\nメッセージ展開: ${ignore[0].expand?"無効":"有効"}`:"無効"
          },
          {
            name: "参加メッセージ",
            value: join[0] ? "設定済み":"未設定"
          },
          {
            name: "退出メッセージ",
            value: leave[0] ? "設定済み":"未設定"
          },
          {
            name: "ピン",
            value: `${pin.length}個設定済み`
          },
          {
            name: "アナウンス自動公開",
            value: `${announce.length}個設定済み`
          }
        ]
      }]
    });
  }
}