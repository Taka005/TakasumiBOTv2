module.exports = async(interaction)=>{
  const fs = require("fs");
  const { Colors } = require("discord.js");
  const fileLoader = require("../../lib/fileLoader");
  if(interaction.options.getSubcommand() === "reload"){
    await interaction.deferReply();

    await Promise.all([
      fs.readdirSync("./module/function/command")
        .map(file=>{
          delete require.cache[require.resolve(`../command/${file}`)];
        }),
      fs.readdirSync("./module/function/contextmenu/")
        .map(file=>{
          delete require.cache[require.resolve(`../contextmenu/${file}`)];
        }),
      fs.readdirSync("./module/event/guildCreate/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/guildCreate/${file}`)];
        }),
      fs.readdirSync("./module/event/guildDelete/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/guildDelete/${file}`)];
        }),
      fs.readdirSync("./module/event/guildMemberAdd/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/guildMemberAdd/${file}`)];
        }),
      fs.readdirSync("./module/event/guildMemberRemove/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/guildMemberRemove/${file}`)];
        }),
      fs.readdirSync("./module/event/interactionCreate/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/interactionCreate/${file}`)];
        }),
      fs.readdirSync("./module/event/messageCreate/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/messageCreate/${file}`)];
        }),
      fs.readdirSync("./module/event/messageUpdate/")
        .map(file=>{
          delete require.cache[require.resolve(`../../event/messageUpdate/${file}`)];
        }),
      fs.readdirSync("./module/lib/")
        .map(file=>{
          delete require.cache[require.resolve(`../../lib/${file}`)];
        }),
      fs.readdirSync("./module/function/slashcommand/")
        .map(file=>{
          delete require.cache[require.resolve(`../slashcommand/${file}`)];
        }),
      fs.readdirSync("./module/function/auth/")
        .map(file=>{
          delete require.cache[require.resolve(`../auth/${file}`)];
        }),
      fs.readdirSync("./module/function/admin/")
        .map(file=>{
          delete require.cache[require.resolve(`../admin/${file}`)];
        }),
      fs.readdirSync("./module/function/setting/")
        .map(file=>{
          delete require.cache[require.resolve(`../setting/${file}`)];
        })
    ]);

    delete require.cache[require.resolve("../../event/ready/command")];
    delete require.cache[require.resolve("../../../config.json")];
    delete require.cache[require.resolve("../../../package.json")];
    delete require.cache[require.resolve("../../../package-lock.json")];
    delete require.cache[require.resolve("../../../file/commandlist")];
    delete require.cache[require.resolve("../../../file/products")];
    delete require.cache[require.resolve("../../../file/gifts")];

    require("../../event/ready/command")(interaction.client);

    await fileLoader();

    await interaction.editReply({
      embeds:[{
        color: Colors.Green,
        description: "リロードが完了しました",
      }]
    });
  }
}