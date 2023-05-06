module.exports = async(interaction)=>{
  const os = require("os");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "status"){

    await interaction.deferReply();
    await interaction.editReply({
      embeds:[{
        color: Colors.Blue,
        description: "計測中...",
        timestamp: new Date()
      }]
    });

    const cpuusage = await new Promise((resolve) =>
      require("os-utils").cpuUsage(resolve)
    );

    const account = await db("SELECT * FROM account;");
    const hiroyuki = await db("SELECT * FROM hiroyuki;");
    const global = await db("SELECT * FROM global;");

    const date = new Date();
    const message = await db(`SELECT SUM(message) as total FROM log WHERE DATE(time) = "${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}";`);
    const command = await db(`SELECT SUM(command) as total FROM log WHERE DATE(time) = "${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}";`);

    const chat = global.length/interaction.client.guilds.cache.size*100;

    await interaction.editReply({
      embeds:[{
        color: Colors.Blue,
        title: "ステータス",
        timestamp: new Date(),
        fields:[
          {
            name: "システム",
            value: `OS: ${os.version()}(${os.type()}) ${os.arch()}\nCPU: ${(cpuusage * 100).toFixed(2)}%\nMemory: ${100 - Math.floor((os.freemem() / os.totalmem()) * 100)}%`
          },
          {
            name: "Discord",
            value: `Ping: ${interaction.client.ws.ping}㍉秒\nGC登録数: ${global.length} / ${interaction.client.guilds.cache.size} (${Math.round(chat)}%)\nひろゆき登録数: ${hiroyuki.length}\nTakasumiBOT Account: ${account.length}人\nServer Uptime: ${Math.round(os.uptime() / 60)}分(BOT: ${Math.round(process.uptime() / 60)}分)`
          },
          {
            name: "統計データ",
            value: `今日のメッセージ数: ${message[0].total}回\n今日のコマンド実行数: ${command[0].total}回`
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
    }).catch((error)=>{
      interaction.editReply({
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