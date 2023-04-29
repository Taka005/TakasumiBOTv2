module.exports = async(interaction,client)=>{
  const { ButtonBuilder, ActionRowBuilder } = require("discord.js");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "avatar"){
    const id = interaction.options.getString("id");

    if(!id){
      return await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${interaction.user.tag}のアバター`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          thumbnail:{
            url: interaction.member.avatarURL({extension:"png",forceStatic:false,size:1024})
          },
          image:{
            url: interaction.user.avatarURL({extension:"png",forceStatic:false,size:1024})||interaction.user.defaultAvatarURL
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          }
        }]
      }).catch(async(error)=>{
        await interaction.reply({
          embeds:[{
            author:{
              name: "取得できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: "RED",
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
                  .setStyle("LINK"))
          ],
          ephemeral: true
        })
      });
    }
  
    const ID = id.match(/\d{18,19}/g);
    if(!ID) return await interaction.reply({
      embeds:[{
        author:{
          name: "取得に失敗しました",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "正確にIDまたは、メンションをしてください"
      }],
      ephemeral: true
    });

    try{
      const member = await interaction.guild.members.cache.get(ID[0]);
      const user = await client.users.fetch(ID[0]);
      
      await interaction.reply({
        embeds:[{
          color: "GREEN",
          author:{
            name: `${user.tag}のアバター`,
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          thumbnail:{
            url: member.avatarURL({extension:"png",forceStatic:false,size:1024})
          },
          image:{
            url: user.avatarURL({extension:"png",forceStatic:false,size:1024})||user.defaultAvatarURL
          },
          timestamp: new Date(),
          footer:{
            text: "TakasumiBOT"
          }
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          author:{
            name: "取得に失敗しました",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: "RED",
          description: "指定されたユーザーは存在しないか、間違っています"
        }],
        ephemeral: true
      });
    }
  }
}