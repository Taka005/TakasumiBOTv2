module.exports = async(interaction)=>{
  const fs = require("fs");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const { execSync } = require("child_process");
  const db = require("../../lib/db");
  const fetchUser = require("../../lib/fetchUser");
  const fetchGuild = require("../../lib/fetchGuild");
  const escape = require("../../lib/escape");
  const { admin } = require("../../../config.json");
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "admin"){

    if(interaction.user.id !== admin) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "権限がありません",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "このコマンドは関係者以外実行できません"
      }],
      ephemeral: true
    });

    if(interaction.options.getSubcommand() === "cmd"){
      const code = interaction.options.getString("code");

      await interaction.deferReply();
      try{
        const data = execSync(code,{
          timeout: 10000
        });

        await interaction.editReply({
          files:[
            new AttachmentBuilder()
              .setFile(Buffer.from(data.toString(),"UTF-8"))
              .setName("cmd.txt")
          ]
        });
      }catch(error){
        await interaction.editReply({
          files:[
            new AttachmentBuilder()
              .setFile(Buffer.from(error.toString(),"UTF-8"))
              .setName("cmd.txt")
          ]
        });
      }
    }else if(interaction.options.getSubcommand() === "db"){
      const query = interaction.options.getString("query");

      const data = JSON.stringify(await db(query),null,"  ");
      await interaction.reply({
        files:[
          new AttachmentBuilder()
            .setFile(Buffer.from(data,"UTF-8"))
            .setName("DB.json")
        ]
      });
    }else if(interaction.options.getSubcommand() === "debug"){
      const type = interaction.options.getString("type");
      const id = interaction.options.getString("id");
      const channel = interaction.options.getChannel("channel");
      const json = interaction.options.getString("json");

      try{
        if(type === "content"){
          const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "取得しました",
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              },
              description: `\`\`\`json\n${JSON.stringify(msg,null,"  ")}\`\`\``
            }]
          });
        }else if(type === "send"){
          await interaction.reply(JSON.parse(json));
        }else if(type === "edit"){
          const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});
          await msg.edit(JSON.parse(json));
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "編集しました",
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }else if(type === "delete"){
          const msg = channel ? await channel.messages.fetch({"message":id}) : await interaction.channel.messages.fetch({"message":id});
          await msg.delete();
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "削除しました",
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }
      }catch(error){
        await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "実行できませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            fields:[
              {
                name: "エラーコード",
                value: `\`\`\`${error}\`\`\``
              }
            ]
          }],
          ephemeral: true
        });
      }
    }else if(interaction.options.getSubcommand() === "mute"){
      const type = interaction.options.getString("type");
      const id = interaction.options.getString("id");
      const reason = interaction.options.getString("reason")||"なし";

      if(type === "user"){
        const user = await fetchUser(interaction.client,id);
        if(!user) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "ユーザーをミュートできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "指定したユーザーが存在しません"
          }],
          ephemeral: true
        });

        const data = await db(`SELECT * FROM mute_user WHERE id = ${user.id};`);
        if(data[0]){
          await db(`DELETE FROM mute_user WHERE id = ${user.id};`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${user.tag}(${user.id}) のミュートを解除しました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }else{
          await db(`INSERT INTO mute_user (id, reason, time) VALUES("${user.id}","${escape(reason)}",NOW());`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${user.tag}(${user.id}) をミュートしました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }
      }else if(type === "server"){
        const guild = await fetchGuild(interaction.client,id);
        if(!guild) return await interaction.reply({
          embeds:[{
            color: Colors.Red,
            author:{
              name: "サーバーをミュートできませんでした",
              icon_url: "https://cdn.taka.cf/images/system/error.png"
            },
            description: "指定したサーバーが存在しません"
          }],
          ephemeral: true
        });

        const data = await db(`SELECT * FROM mute_server WHERE id = ${guild.id};`);
        if(data[0]){
          await db(`DELETE FROM mute_server WHERE id = ${guild.id};`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${guild.name}(${guild.id}) のミュートを解除しました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }else{
          await db(`INSERT INTO mute_server (id, reason, time) VALUES("${guild.id}","${escape(reason)}",NOW())`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${guild.name}(${guild.id}) をミュートしました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }
      }else if(type === "ip"){
        const data = await db(`SELECT * FROM mute_ip WHERE ip = "${id}";`);
        if(data[0]){
          await db(`DELETE FROM mute_ip WHERE ip = "${id}";`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${id} のミュートを解除しました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }else{
          await db(`INSERT INTO mute_ip (ip, reason, time) VALUES("${id}","${escape(reason)}",NOW())`);

          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${id} をミュートしました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        }
      }
    }else if(interaction.options.getSubcommand() === "leave"){
      const id = interaction.options.getString("id");

      const guild = await fetchGuild(interaction.client,id);
      if(!guild) return await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "サーバーから脱退できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "指定したサーバーが存在しません"
        }],
        ephemeral: true
      });

      await guild.leave()
        .then(async(g)=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: `${g.name}(${guild.id}) から脱退しました`,
                icon_url: "https://cdn.taka.cf/images/system/success.png"
              }
            }]
          });
        })
        .catch(async(error)=>{
          await interaction.reply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "サーバーから脱退できませんでした",
                icon_url: "https://cdn.taka.cf/images/system/error.png"
              },
              fields:[
                {
                  name: "エラーコード",
                  value: `\`\`\`${error}\`\`\``
                }
              ]
            }],
            ephemeral: true
          });
        });
    }else if(interaction.options.getSubcommand() === "reload"){
      await interaction.deferReply();

      await Promise.all([
        fs.readdirSync("./module/function/command")
          .map(file=>{
            require(`../command/${file}`);
            delete require.cache[require.resolve(`../command/${file}`)];
          }),
        fs.readdirSync("./module/function/contextmenu/")
          .map(file=>{
            require(`../contextmenu/${file}`);
            delete require.cache[require.resolve(`../contextmenu/${file}`)];
          }),
        fs.readdirSync("./module/event/guildCreate/")
          .map(file=>{
            require(`../../event/guildCreate/${file}`);
            delete require.cache[require.resolve(`../../event/guildCreate/${file}`)];
          }),
        fs.readdirSync("./module/event/guildDelete/")
          .map(file=>{
            require(`../../event/guildDelete/${file}`);
            delete require.cache[require.resolve(`../../event/guildDelete/${file}`)];
          }),
        fs.readdirSync("./module/event/guildMemberAdd/")
          .map(file=>{
            require(`../../event/guildMemberAdd/${file}`);
            delete require.cache[require.resolve(`../../event/guildMemberAdd/${file}`)];
          }),
        fs.readdirSync("./module/event/guildMemberRemove/")
          .map(file=>{
            require(`../../event/guildMemberRemove/${file}`);
            delete require.cache[require.resolve(`../../event/guildMemberRemove/${file}`)];
          }),
        fs.readdirSync("./module/event/interactionCreate/")
          .map(file=>{
            require(`../../event/interactionCreate/${file}`);
            delete require.cache[require.resolve(`../../event/interactionCreate/${file}`)];
          }),
        fs.readdirSync("./module/event/messageCreate/")
          .map(file=>{
            require(`../../event/messageCreate/${file}`);
            delete require.cache[require.resolve(`../../event/messageCreate/${file}`)];
          }),
        fs.readdirSync("./module/event/messageUpdate/")
          .map(file=>{
            require(`../../event/messageUpdate/${file}`);
            delete require.cache[require.resolve(`../../event/messageUpdate/${file}`)];
          }),
        fs.readdirSync("./module/lib/")
          .map(file=>{
            require(`../../lib/${file}`);
            delete require.cache[require.resolve(`../../lib/${file}`)];
          }),
        fs.readdirSync("./module/function/slashcommand/")
          .map(file=>{
            require(`../slashcommand/${file}`);
            delete require.cache[require.resolve(`../slashcommand/${file}`)];
          }),
        fs.readdirSync("./module/function/auth/")
          .map(file=>{
            require(`../auth/${file}`);
            delete require.cache[require.resolve(`../auth/${file}`)];
          })
      ]);

      delete require.cache[require.resolve("../../event/ready/command")];
      delete require.cache[require.resolve("../../../config.json")];
      delete require.cache[require.resolve("../../../package.json")];
      delete require.cache[require.resolve("../../../package-lock.json")];
      delete require.cache[require.resolve("../../../file/commandlist")];

      require("../../event/ready/command")(interaction.client);

      await require("../../lib/fileLoader")();

      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          description: "リロードが完了しました",
        }]
      });
    }
  }
}