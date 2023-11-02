module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const crypto = require("crypto");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "cipher"){
    const type = interaction.options.getString("type");
    const text = interaction.options.getString("text");
    const key = interaction.options.getString("key");

    if(type === "cipher"){
      try{
        const cipher = crypto.createCipher("aes-256-cbc",key);
        cipher.update(text,"utf8","hex");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "暗号を生成しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `暗号: \`\`\`${cipher.final("hex")}\`\`\`\n復号鍵: ||\`${key}\`||`
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "暗号が生成できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
          ]
        });
      }
    }else{
      try{
        const decipher = crypto.createDecipher("aes-256-cbc",key);
        decipher.update(text,"hex","utf8");

        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "暗号を復号しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            },
            description: `復号: \`\`\`${decipher.final("utf8")}\`\`\`\n復号鍵: ||\`${key}\`||`
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "暗号が復号できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "復号鍵が間違っている可能性があります",
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          components:[
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel("サポートサーバー")
                  .setURL("https://discord.gg/NEesRdGQwD")
                  .setStyle(ButtonStyle.Link))
          ]
        });
      }
    }
  }
}