module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "about"){
    
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        title: Lang.get("command.about.AboutBot"),
        description: "便利な多機能BOTを目指して開発されています\nサポートサーバーへの参加もよろしくお願いします\n開発:[Taka005#6668](https://discord.com/users/790489873957781536)\n\n関連リンク\n[公式サイト](https://takasumibot.taka.ml/)\n[ステータス](https://status.taka.ml/)\n[グローバルチャット利用規約](https://gc.taka.ml/)\n[TakasumiBOT Auth](https://auth.taka.ml/)\n[個人サイト](https://taka.ml/)"
      }],
      components:[
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel(Lang.get("command.about.BotInvite"))
              .setURL("https://discord.com/api/oauth2/authorize?client_id=981314695543783484&permissions=8796093022199&scope=bot%20applications.commands")
              .setStyle(ButtonStyle.Link))
          .addComponents(
            new ButtonBuilder()
              .setLabel(Lang.get("SupportServer"))
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle(ButtonStyle.Link))
      ]
    });
  }
}