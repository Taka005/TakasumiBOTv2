module.exports = async(message)=>{
  if(message.content === ">automod"){
    Array(6).forEach(()=>{
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
    });
  }
}