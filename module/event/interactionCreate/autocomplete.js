module.exports = async(interaction)=>{
  const commnads = require("../../../file/commandlist");
  const langs = require("../../../file/langs.json");
  if(!interaction.isAutocomplete()) return;
  const focus = interaction.options.getFocused();

  if(interaction.commandName === "help"){
		const filter = Object.keys(commnads).filter(name=>name.startsWith(focus));

    if(filter.length > 25) filter.length = 25;

		await interaction.respond(
			filter.map(name=>({ name: `${commnads[name].name}: ${commnads[name].description}`, value: name }))
		);
  }else if(interaction.commandName === "activity"){
    const filter = (await interaction.guild.members.fetch())
      .filter(member=>member.presence?.activities[0])
      .map(member=>member.presence.activities[0].name)
      .filter((activity,i,array)=>array.indexOf(activity) === i)
      .filter(name=>name.startsWith(focus));

    if(filter.length > 25) filter.length = 25;

		await interaction.respond(
			filter.map(name=>({ name: name, value: name }))
		);
  }else if(interaction.commandName === "script"){
    const filter = langs.filter(lang=>lang.name.startsWith(focus));

    if(filter.length > 25) filter.length = 25;

		await interaction.respond(
			filter.map(lang=>({ name: `${lang.name}(${lang.compiler})`, value: lang.compiler }))
		);
  }
}