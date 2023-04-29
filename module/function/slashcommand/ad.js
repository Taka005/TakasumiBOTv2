module.exports = async(interaction,client)=>{
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ad"){
    const type = interaction.options.getString("type");
    const server = Math.floor(client.guilds.cache.size/10)*10;
    
    if(type === "normal"){
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          description: `**◢◤◢◤◢◤ TakasumiBOT ◢◤◢◤◢◤**\nとても便利なBOTです\nグローバルチャット、認証機能などさまざまな便利機能があります\n導入数 ${server}サーバー超え!\n\n・招待\nhttps://bot.taka.ml/\n・ 公式サイト\nhttps://takasumibot.taka.ml/\n・ステータス\nhttps://status.taka.ml/\n・TakasumiBOT Auth\nhttps://auth.taka.ml/\n・グローバルチャットのガイド\nhttps://gc.taka.ml/\n・サポートサーバー\nhttps://discord.gg/NEesRdGQwD\n・Email\ntakasumibot@gmail.com\n\nよければプロジェクトに貢献してください\nhttps://github.com/Taka005/TakasumiBOT\n**◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤**`
        }]
      });
    }else{
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          description: `**◢◤◢◤◢◤ TakasumiBOT ◢◤◢◤◢◤**\nとても便利なBOTです\nグローバルチャット、認証機能などさまざまな便利機能があります\n導入数 ${server}サーバー超え!\n\n・招待\nhttps://bot.taka.ml/\n・公式サイト\nhttps://takasumibot.taka.ml/\n・サポートサーバー\nhttps://discord.gg/NEesRdGQwD\n**◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤**`
        }]
      });
    }
  }
}