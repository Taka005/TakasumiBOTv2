module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { Colors } = require("discord.js");
  require("dotenv").config();
  if(!interaction.isChatInputCommand()) return;
  if(interaction.commandName === "ip"){
    const address = interaction.options.getString("address");

    if(!(
      address.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)||
      address.match(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/)
    )) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "取得できませんでした",
          icon_url: "https://cdn.taka.cf/images/system/error.png"
        },
        description: "IPアドレスを指定してください"
      }],
      ephemeral: true
    });

    try{
      const data = await fetch(`https://api.ip2location.io/?key=${process.env.IP_KEY}&ip=${address}`)
        .then(res=>res.json());

      await interaction.reply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: `${address}の検索結果`,
            icon_url: "https://cdn.taka.cf/images/system/success.png"
          },
          fields:[
            {
              name: "国名",
              value: data.country_name
            },
            {
              name: "地域名",
              value: data.region_name
            },
            {
              name: "都市名",
              value: data.city_name
            },
            {
              name: "位置",
              value: `緯度${data.latitude.toFixed(1)}度\n経度${data.longitude.toFixed(1)}度`
            },
            {
              name: "プロバイダー",
              value: data.as
            },
            {
              name: "プロキシ",
              value: data.is_proxy ? "使用しています":"使用していません"
            }
          ],
          footer:{
            text: "TakasumiBOT"
          },
          timestamp: new Date()
        }]
      });
    }catch{
      await interaction.reply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "取得できませんでした",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          description: "有効なIPアドレスを指定してください"
        }],
        ephemeral: true
      });
    }
  }
}