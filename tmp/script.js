const db = require("../module/lib/db");

(await db("SELECT * FROM server;"))
  .filter(server=>server.count === "undefined")
  .forEach(async server=>{
    await client.guilds.fetch({
      guild: server.id,
      withCounts: true
    })
      .then(async g=>{
        await db(`UPDATE server SET count = "${g.memberCount||100}" WHERE id = ${server.id}`);
      });
  });