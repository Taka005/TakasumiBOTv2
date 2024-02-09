module.exports = async(interaction)=>{
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "register"){

    if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドを実行するには以下の権限を持っている必要があります",
        fields:[
          {
            name: "必要な権限",
            value: "```管理者```"
          }
        ]
      }],
      ephemeral: true
    });

    if(!interaction.guild.members.me.permissionsIn(interaction.channel).has(PermissionFlagsBits.CreateInstantInvite)) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "BOTに権限がありません",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "このコマンドはBOTに以下の権限が必要です",
        fields:[
          {
            name: "必要な権限",
            value: "```招待リンクの作成```"
          }
        ]
      }],
      ephemeral: true
    });

    const data = await db(`SELECT * FROM server WHERE id = ${interaction.guild.id};`);
    if(data[0]){
      await db(`DELETE FROM server WHERE id = ${interaction.guild.id};`);

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "登録を解除しました",
            icon_url: "https://cdn.takasumibot.com/images/system/success.png"
          }
        }]
      });
    }else{
      if(Date.now() - interaction.guild.members.me.joinedAt < 86400000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "サーバー掲示板に登録するにはBOTをサーバーに追加してから1日経過する必要があります"
        }],
        ephemeral: true
      });

      if((await interaction.guild.members.fetch()).filter(m=>!m.user.bot).size < 10) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "サーバー掲示板に登録するにはサーバーに10人以上のユーザーが必要です"
        }],
        ephemeral: true
      });

      const account = await db(`SELECT * FROM account WHERE id = ${interaction.user.id};`);
      if(!account[0]) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: "このサーバーを掲示板に登録するには認証する必要があります"
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サイトへ飛ぶ")
                .setURL("https://auth.takasumibot.com/")
                .setStyle(ButtonStyle.Link)
            )
        ],
        ephemeral: true
      });

      if(new Date()-new Date(account[0].time)>600000) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "登録できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          description: `前回の認証から10分以上が経過しているため再度認証を行なってください\n前回の認証日時: ${new Date(account[0].time).toLocaleString()}`
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setLabel("サイトへ飛ぶ")
                .setURL("https://auth.takasumibot.com/")
                .setStyle(ButtonStyle.Link)
            )
        ],
        ephemeral: true
      });

      const register = new ModalBuilder()
        .setCustomId("register")
        .setTitle("サーバー掲示板登録");

      const text = new TextInputBuilder()
        .setCustomId("text")
        .setLabel("サーバーの説明文")
        .setMaxLength(180)
        .setMinLength(30)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);

      register.addComponents(
        new ActionRowBuilder()
          .addComponents(text)
      );

      await interaction.showModal(register);
    }
  }
}