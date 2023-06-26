module.exports = (message)=>{
  if(message.content === ">automod"){
    await message.guild.autoModerationRules.create({
      name: "AutoMod"+Math.random(),
      eventType: 1,
      triggerType: 1,
      enabled: true,
      triggerMetadata:{
        keywordFilter: ["fuck"]
      },
      actions: [{
        type: 1
      }]
    });
  }
}