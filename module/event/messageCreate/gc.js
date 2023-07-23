const spam = require("../../lib/spam");
const Spam = new spam(800);

module.exports = async(message)=>{
  const { WebhookClient, ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");
  const db = require("../../lib/db");
  const fetchMessage = require("../../lib/fetchMessage");
  const fetchWebhookMessage = require("../../lib/fetchWebhookMessage");
  const money = require("../../lib/money");
  const { admin } = require("../../../config.json");

  if(message.author.bot) return;
  const global = await db(`SELECT * FROM global WHERE channel = ${message.channel.id} LIMIT 1;`);
  if(!global[0]) return;

  if(
    (await db(`SELECT * FROM mute_server WHERE id = ${message.guild.id} LIMIT 1;`))[0]||
    (await db(`SELECT * FROM mute_user WHERE id = ${message.author.id} LIMIT 1;`))[0]||
    message.content.length > 300||
    Spam.count(message.guild.id)
  ) return await message.react("❌").catch(()=>{});

  if(!(await db(`SELECT * FROM account WHERE id = ${message.author.id} LIMIT 1;`))[0]) return await message.reply({ 
    embeds:[{
      author:{
        name: "利用規約に同意してください",
        icon_url: "https://cdn.taka.cf/images/system/error.png"
      },
      color: Colors.Red,
      description: "以下のリンクから認証を行うことでグローバルチャットを利用できます\n認証が完了すると[利用規約](https://gc.taka.cf/)に同意したものとみなします",
    }], 
    components:[
      new ActionRowBuilder()
        .addComponents( 
          new ButtonBuilder()
            .setLabel("サイトへ飛ぶ")
            .setURL("https://auth.taka.cf/")
            .setStyle(ButtonStyle.Link))
        .addComponents( 
          new ButtonBuilder()
            .setLabel("サポートサーバー")
            .setURL("https://discord.gg/NEesRdGQwD")
            .setStyle(ButtonStyle.Link))
    ]
  }).catch(()=>{});

  const content = message.content
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,"[[招待リンク]](https://discord.gg/NEesRdGQwD)")

  let color = Colors.Green;
  if(message.author.id === admin){
    color = Colors.Blue;
  }else if((await money.get(message.author.id)).gc > 0){
    color = Colors.Yellow
  }

  const embed = [{
    color: color,
    author:{
      name: message.author.tag,
      url: `https://discord.com/users/${message.author.id}`,
      icon_url: message.author.avatarURL()||message.author.defaultAvatarURL,
    },
    description: content,
    footer:{
      text: `${message.guild.name}(${message.guild.id})`,
      icon_url: message.guild.iconURL()||"https://cdn.discordapp.com/embed/avatars/0.png"
    },
    timestamp: new Date()
  }];

  if(message.reference?.messageId){
    const replyWebhook = new WebhookClient({id: global[0].id, token: global[0].token});
    const replyWebhookMessage = await fetchWebhookMessage(replyWebhook,message.reference.messageId);
    if(replyWebhookMessage){
      embed[0].fields = [
        {
          name: "\u200b",
          value: `**${replyWebhookMessage.embeds[0].author.name}>>** ${replyWebhookMessage.embeds[0].description||"なし"}`
        }
      ];
    }else{
      const replyMessage = await fetchMessage(message.channel,message.reference.messageId);
      if(replyMessage){
        embed[0].fields = [
          {
            name: "\u200b",
            value: `**${replyMessage.author.tag}>>** ${replyMessage.content||"なし"}`
          }
        ];
      }
    }
  }

  const attachment = message.attachments.first();
  if(attachment){
    if(attachment.height&&attachment.width){
      embed.push({
        color: Colors.Green,
        title: attachment.name,
        description: `[ファイルを開く](${attachment.url})`,
        image:{
          url: attachment.url
        }
      });
    }else{
      embed.push({
        color: Colors.Green,
        title: attachment.name,
        description: `[ファイルを開く](${attachment.url})`
      });
    }
  }

  (await db("SELECT * FROM global;")).map(async(data)=>{
    const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
    if(data.server === message.guild.id||mute[0]) return;

    const webhook = new WebhookClient({id: data.id, token: data.token});
    await webhook.send({
      embeds: embed,
      username: "TakasumiBOT Global",
      avatarURL: "https://cdn.taka.cf/images/icon.png"
    }).catch(async(error)=>{
      await db(`DELETE FROM global WHERE channel = ${data.channel} LIMIT 1;`);
      await message.client.channels.cache.get(data.channel).send({
        embeds:[{
          author:{
            name: "グローバルチャットでエラーが発生しました",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          color: Colors.Red,
          description: "エラーが発生したため、強制的に切断されました\n再度登録するには`/global`を使用してください",
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
      }).catch(()=>{});
    });
  });

  await message.react("✅").catch(()=>{});
}