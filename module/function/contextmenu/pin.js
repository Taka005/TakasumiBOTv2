module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isContextMenuCommand()) return;
  if(interaction.commandName === "メッセージをピン留め"){
    const message = interaction.options.getMessage("message");

    if(!message.content) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "メッセージをピン留めできませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "メッセージの内容が存在しません"
      }],
      ephemeral: true
    });

    if(
      !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)||
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```メッセージの管理\nチャンネルの管理```"
          }
        ]
      }],
      ephemeral: true
    });

    if(
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ViewChannel)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.SendMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageMessages)||
      !interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.ManageChannels)
    ) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```チャンネルの閲覧\nチャンネルの管理\nメッセージの送信\nメッセージの管理```"
          }
        ]
      }],
      ephemeral: true
    });
      
    const channel = await db(`SELECT * FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
    const server = await db(`SELECT * FROM pin WHERE server = ${message.guild.id};`);
    if(!channel[0]){
      if(server[0]?.count > 5) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "メッセージをピン留めできませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "サーバーには最大6個までしかPINは使えません"
        }],
        ephemeral: true
      });

      try{
        await interaction.deferReply()
          .then(()=>interaction.deleteReply());
  
        const msg = await interaction.channel.send({
          embeds:[{
            color: Colors.Green,
            author:{
              name: message.author.tag,
              icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
            },
            description: message.content,
            footer:{
              text: "TakasumiBOT PIN"
            }
          }]
        });
  
        await db(`INSERT INTO pin (channel, server, message, count, time) VALUES("${message.channel.id}","${message.guild.id}","${msg.id}","${server[0]?.count||"0"}",NOW());`);
        await db(`UPDATE pin SET count = ${Number(server[0]?.count||0) + 1} WHERE server = ${message.guild.id};`);
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "メッセージをピン留めできませんでした",
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
          ],
          ephemeral: true
        });
      }
    }else{
      try{
        await (await message.channel.messages.fetch(channel[0].message)).delete();

        await db(`UPDATE pin SET count = ${Number(server[0].count)-1} WHERE server = ${message.guild.id};`);
        await db(`DELETE FROM pin WHERE channel = ${message.channel.id} LIMIT 1;`);
  
        await interaction.reply({
          embeds:[{
            color: Colors.Green,
            author:{
              name: "ピン留めを削除しました",
              icon_url: "https://cdn.taka.cf/images/system/success.png"
            }
          }]
        });
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "ピン留めを削除できませんでした",
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
          ],
          ephemeral: true
        });
      }
    }
  }
}