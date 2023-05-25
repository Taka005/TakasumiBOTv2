module.exports = async(interaction,Lang)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const fetchMember = require("../../lib/fetchMember");
  const fetchUser = require("../../lib/fetchUser");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "avatar"){
    const id = interaction.options.getString("id");

    if(!id) return await interaction.reply({
      embeds:[{
        color: Colors.Green,
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
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date(),
      }]
    }).catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
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
        ],
        ephemeral: true
      })
    });
  
    const userId = id.match(/\d{18,19}/g);
    if(!userId) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "ユーザーID、メンションを入力してください"
      }],
      ephemeral: true
    });

    const member = await fetchUser(interaction.guild,userId[0]);
    const user = await fetchMember(interaction.client,userId[0]);
    
    if(!user) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        description: "指定されたユーザーが存在しません"
      }],
      ephemeral: true
    });

    await interaction.reply({
      embeds:[{
        color: Colors.Green,
        author:{
          name: `${user.tag}のアバター`,
          icon_url: "https://cdn.taka.ml/images/system/success.png"
        },
        thumbnail:{
          url: member?.avatarURL({extension:"png",forceStatic:false,size:1024})
        },
        image:{
          url: user.avatarURL({extension:"png",forceStatic:false,size:1024})||user.defaultAvatarURL
        },
        footer:{
          text: "TakasumiBOT"
        },
        timestamp: new Date(),
      }]
    }).catch(async(error)=>{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
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
        ],
        ephemeral: true
      })
    });
  }
}