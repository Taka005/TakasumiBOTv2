module.exports = async(interaction)=>{
  const { Colors } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ad"){
    const server = Math.floor(interaction.client.guilds.cache.size/10)*10;
    
    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        description: `**◢◤◢◤◢◤ TakasumiBOT ◢◤◢◤◢◤**\nとても便利なBOTです\nグローバルチャット、認証機能などさまざまな便利機能があります\n導入数 ${server}サーバー超え!\n\n・招待\nhttps://bot.taka.ml/\n・ 公式サイト\nhttps://takasumibot.taka.ml/\n・ステータス\nhttps://status.taka.ml/\n・TakasumiBOT Auth\nhttps://auth.taka.ml/\n・グローバルチャットのガイド\nhttps://gc.taka.ml/\n・サポートサーバー\nhttps://discord.gg/NEesRdGQwD\n・Email\ntakasumibot@gmail.com\n\nよければプロジェクトに貢献してください\nhttps://github.com/Taka005/TakasumiBOTv2\n**◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤**`
      }]
    });
  }
}