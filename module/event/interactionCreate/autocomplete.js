module.exports = async(interaction)=>{
  const commnads = require("../../../file/commandlist.json");
  if(interaction.isAutocomplete()){
    const focus = interaction.options.getFocused();
		const filter = Object.keys(commnads).filter(name=>name.startsWith(focus));
    if(filter.length > 25) return await interaction.respond([]);
    
		await interaction.respond(
			filter.map(name=>({ name: `/${name}: ${commnads[name].description}`, value: name }))
		);
  }
}