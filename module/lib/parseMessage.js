module.exports = (value)=>{
  const config = require("../../config.json");

  return value
    .replace(/(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|(?:discord|discordapp)\.com\/invite)\/(\w+)/g,`[[招待リンク]](${config.inviteUrl})`)
}