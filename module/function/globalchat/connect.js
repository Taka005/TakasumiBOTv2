module.exports = async(msg)=>{
  const db = require("../../lib/db");
  const convert = require("../../lib/convert");
  const { WebhookClient, Colors } = require("discord.js");
  const async = require("async");

  const data = await db(`SELECT * FROM global WHERE channel = ${msg.channel.id} LIMIT 1;`);
  if(!data[0]) return;
  const message = await convert(msg);

  const global = await db("SELECT * FROM global;");

  if(!message.reply.isReply){
    if(!message.attachments.isAttachments){
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              footer:{
                text: `${message.guild.name}<${message.guild.id}>`,
                icon_url: message.guild.iconURL
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
          err(data.channel,message.client,error);
        });
      });
    }else if(!message.attachments.attachment[0].isFile){//添付ファイルあり(画像)
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              footer:{
                text: `${message.guild.name}<${message.guild.id}>`,
                icon_url: message.guild.iconURL
              },
              image:{
                url: `https://${message.id}.ugc`
              },
              timestamp: new Date()
            },
            {
              title: message.attachments.attachment[0].name,
              description: `[リンク](${message.attachments.attachment[0].url})`,
              image:{
                url: message.attachments.attachment[0].url
              }
            }
          ],
          username: "TakasumiBOT Global",
          avatarURL: "https://cdn.taka.ml/images/icon.png"
        }).catch((error)=>{
          err(data.channel,message.client,error);
        });
      });
    }else{//添付ファイルあり(画像以外)
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              footer:{
                text: `${message.guild.name}<${message.guild.id}>` ,
                icon_url: message.guild.iconURL
              },
              fields:[
                {
                  name: "添付ファイル",
                  value: `[${message.attachments.attachment[0].name}](${message.attachments.attachment[0].url})`
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
          err(data.channel,message.client,error);
        });
      });
    }
  }else{
    if(!message.attachments.isAttachments){
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              fields:[
                {
                  name: "\u200b",
                  value: `**${message.reply.user.tag}>>** ${message.reply.content||"なし"}`
                }
              ],
              footer:{
                text: `${message.guild.name}<${message.guild.id}>`,
                icon_url: message.guild.iconURL
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
          err(data.channel,message.client,error);
        });
      });
    }else if(!message.attachments[0].isFile){//添付ファイルあり(画像)
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              fields:[
                {
                  name: "\u200b",
                  value: `**${message.reply.user.tag}>>** ${message.reply.content||"なし"}`
                }
              ],
              footer:{
                text: `${message.guild.name}<${message.guild.id}>`,
                icon_url: message.guild.iconURL
              },
              image:{
                url: `https://${message.id}.ugc`
              },
              timestamp: new Date()
            },
            {
              title: message.attachments.attachment[0].name,
              description: `[元ファイルを開く](${message.attachments.attachment[0].url})`,
              image:{
                url: message.attachments.attachment[0].url
              }
            }
          ],
          username: "TakasumiBOT Global",
          avatarURL: "https://cdn.taka.ml/images/icon.png"
        }).catch((error)=>{
          err(data.channel,message.client,error);
        });
      });
    }else{//添付ファイルあり(画像以外)
      async.each(global,async(data)=>{
        const mute = await db(`SELECT * FROM mute_server WHERE id = ${data.server} LIMIT 1;`);
        if(data.server === message.guild.id||mute[0]) return;
  
        const webhooks = new WebhookClient({id: data.id, token: data.token});
        await webhooks.send({
          embeds:[
            {
              color: Colors.Green,
              author:{
                name: `${message.author.tag}[UGC]`,
                url: `https://discord.com/users/${message.author.id}`,
                icon_url: message.author.avatarURL,
              },
              description: message.content,
              footer:{
                text: `${message.guild.name}<${message.guild.id}>` ,
                icon_url: message.guild.iconURL
              },
              fields:[
                {
                  name: "添付ファイル",
                  value: `[${message.attachments.attachment[0].name}](${message.attachments.attachment[0].url})`
                },
                {
                  name: "\u200b",
                  value: `**${message.reply.user.tag}>>** ${message.reply.content||"なし"}`
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
          err(data.channel,message.client,error);
        });
      });
    }
  }
}

function err(channel,client,error){
  const db = require("../../lib/db");
  const { ButtonBuilder, ActionRowBuilder, ButtonStyle, Colors } = require("discord.js");

  db(`DELETE FROM global WHERE channel = ${channel} LIMIT 1;`);
  client.channels.cache.get(channel).send({
    embeds:[{
      author:{
        name: "グローバルチャットでエラーが発生しました",
        icon_url: "https://cdn.taka.ml/images/system/error.png"
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
  })
  .catch(()=>{});
}