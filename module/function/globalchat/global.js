module.exports = async(message,client)=>{
  const db = require("../../lib/db");
  const spam = require("../../lib/spam");
  const { WebhookClient, MessageButton, MessageActionRow } = require("discord.js");
  const async = require("async");

  const data = await db(`SELECT * FROM global WHERE channel = ${message.channel.id} LIMIT 1;`);
  
  if(
    message.reference?.messageId||
    !data[0]
  ) return;

  const mute_server = await db(`SELECT * FROM mute_server WHERE id = ${message.guild.id} LIMIT 1;`);
  const mute_user = await db(`SELECT * FROM mute_user WHERE id = ${message.author.id} LIMIT 1;`);

  const account = await db(`SELECT * FROM account WHERE id = ${message.author.id} LIMIT 1;`);
  if(!account[0]){
    return await message.reply({ 
      embeds:[{
        author:{
          name: "利用規約に同意してください",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: "RED",
        description: "以下のリンクから認証を行うことでグローバルチャットを利用できます\n認証が完了すると[利用規約](https://gc.taka.ml/)に同意したものとみなします",
      }], 
      components:[
        new MessageActionRow()
          .addComponents( 
            new MessageButton()
              .setLabel("サイトへ飛ぶ")
              .setURL("https://auth.taka.ml/")
              .setStyle("LINK"))
          .addComponents( 
            new MessageButton()
              .setLabel("サポートサーバー")
              .setURL("https://discord.gg/NEesRdGQwD")
              .setStyle("LINK"))
      ]
    }).catch(()=>{});
  }
  
  if(
    mute_server[0]||
    mute_user[0]||
    message.content.length > 300||
    spam(message)
  ){
    return message.react("❌")
      .catch(()=>{}) 
  }

  const content = message.content
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[[招待リンク]](https://discord.gg/NEesRdGQwD)")

  await message.react("🔄")
    .catch(()=>{});

  const global = await db("SELECT * FROM global;");

  if(!message.attachments.first()){//添付ファイルなし
    async.each(global,async(data)=>{
      const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
      if(data.server === message.guild.id||mute[0]) return;

      const webhooks = new WebhookClient({id: data.id, token: data.token});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor||"RANDOM",
            author:{
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
            },
            description: content,
            footer:{
              text:`${message.guild.name}<${message.guild.id}>`,
              icon_url:message.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            image:{
              url: `https://${message.id}.ugc`
            },
            timestamp: new Date()
          }
        ],
        username: "TakasumiBOT Global",
        avatarURL: "https://cdn.taka.ml/images/icon.png"
      }).catch((error)=>{
        err(data.channel,client,error);
      });
    });
    await message.react("✅")
      .catch(()=>{});
  }else if(message.attachments.first().height && message.attachments.first().width){//添付ファイルあり(画像)
    const attachment = message.attachments.map(attachment => attachment);
    async.each(global,async(data)=>{
      const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
      if(data.server === message.guild.id||mute[0]) return;

      const webhooks = new WebhookClient({id: data.id, token: data.token});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor||"RANDOM",
            author:{
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
            },
            description: content,
            footer:{
              text: `${message.guild.name}<${message.guild.id}>`,
              icon_url: message.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            image:{
              url: `https://${message.id}.ugc`
            },
            timestamp: new Date()
          },
          {
            title: attachment[0].name,
            description: `[元ファイルを開く](${attachment[0].url})`,
            image:{
              url: attachment[0].url
            }
          }
        ],
        username: "TakasumiBOT Global",
        avatarURL: "https://cdn.taka.ml/images/icon.png"
      }).catch((error)=>{
        err(data.channel,client,error);
      });
    });
    await message.react("✅")
      .catch(()=>{});
  }else{//添付ファイルあり(画像以外)
    const attachment = message.attachments.map(attachment => attachment);
    async.each(global,async(data)=>{
      const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
      if(data.server === message.guild.id||mute[0]) return;

      const webhooks = new WebhookClient({id: data.id, token: data.token});
      await webhooks.send({
        embeds:[
          {
            color: (await message.author.fetch()).hexAccentColor||"RANDOM",
            author:{
              name: `${message.author.tag}`,
              url: `https://discord.com/users/${message.author.id}`,
              icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
            },
            description: content,
            footer:{
              text: `${message.guild.name}<${message.guild.id}>` ,
              icon_url: message.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
            },
            fields:[
              {
                name: "添付ファイル",
                value: `[${attachment[0].name}](${attachment[0].url})`
              }
            ],
            image:{
              url: `https://${message.id}.ugc`
            },
            timestamp: new Date()
          }
        ],
        username: "TakasumiBOT Global",
        avatarURL: "https://cdn.taka.ml/images/icon.png"
      }).catch((error)=>{
        err(data.channel,client,error);
      });
    });
    await message.react("✅")
      .catch(()=>{});
  }
}

function err(channel,client,error){
  const db = require("../lib/db");
  const { MessageButton, MessageActionRow } = require("discord.js");

  db(`DELETE FROM global WHERE channel = ${channel} LIMIT 1;`);
  client.channels.cache.get(channel).send({
    embeds:[{
      author:{
        name: "グローバルチャットでエラーが発生しました",
        icon_url: "https://cdn.taka.ml/images/system/error.png"
      },
      color: "RED",
      description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
      fields:[
        {
          name: "エラーコード",
          value: `\`\`\`${error}\`\`\``
        }
      ]
    }],
    components:[
      new MessageActionRow()
        .addComponents( 
          new MessageButton()
            .setLabel("サポートサーバー")
            .setURL("https://discord.gg/NEesRdGQwD")
            .setStyle("LINK"))
    ]
  })
  .catch(()=>{});
}