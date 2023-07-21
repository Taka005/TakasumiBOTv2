module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "about"){
    
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        title: "TakasumiBOTとは",
        description: "便利な多機能BOTを目指して開発されています\nサポートサーバーへの参加もよろしくお願いします\n開発:[@taka005](https://discord.com/users/790489873957781536)\n\n関連リンク\n[公式サイト](https://takasumibot.taka.ml/)\n[ステータス](https://status.taka.ml/)\n[グローバルチャット利用規約](https://gc.taka.ml/)\n[TakasumiBOT Auth](https://auth.taka.cf/)\n[個人サイト](https://taka.ml/)"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel("BOTを追加")
              .setURL("https://discord.com/api/oauth2/authorize?client_id=981314695543783484&permissions=8796093022199&scope=bot%20applications.commands")
              .setStyle(ButtonStyle.Link))
          .addComponents(
            new ButtonBuilder()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
      ]
    });
  }
}