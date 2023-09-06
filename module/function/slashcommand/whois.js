module.exports = async(interaction)=>{
  const { AttachmentBuilder, Colors } = require("discord.js");
  const whois = require("../../lib/whois");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "whois"){
    const domain = interaction.options.getString("domain");

    if(!domain.match(/^([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "ドメインを指定してください"
      }],
      ephemeral: true
    });
    
    try{
      const refer = (await whois("whois.iana.org",domain)).match(/refer:\s*(.*)/);
      if(!refer?.[1]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "有効なドメインを指定してください"
        }],
        ephemeral: true
      });

      const data = await whois(refer[1],domain);
      await interaction.reply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(data)) 
            .setName(`WHOIS_${domain}.txt`)
        ]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "正しいドメインを指定してください"
        }],
        ephemeral: true
      });
    }
  }
}