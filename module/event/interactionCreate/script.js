module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  const langs = require("../../../file/langs.json");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("script_")){
    const data = interaction.customId.split("_");
    const code = interaction.fields.getTextInputValue("code");

    const lang = langs.find(lang=>lang.compiler === data[1]);
    if(!lang) return await interaction.reply({
      embeds:[{
        color: Colors.Red,
        author:{
          name: "実行できませんでした",
          icon_url: "https://cdn.takasumibot.com/images/system/error.png"
        },
        description: "存在しない言語です"
      }],
      ephemeral: true
    });

    const controller = new AbortController();
    setTimeout(()=>{
      controller.abort();
    },3000);

    await interaction.deferReply();
    try{
      const res = await fetch("https://wandbox.org/api/compile.json",{
        method: "POST",
        header:{
          "content-type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          "code": code,
          "compiler": lang.compiler
        })
      }).then(res=>res.json());

      if(res.status === "0"){
        try{
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "実行しました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              },
              description: `**コード**\n\`\`\`${code}\`\`\`\n**結果**\n\`\`\`${res.program_output||"なし"}\`\`\``,
              footer:{
                text: `${lang.name}(${lang.compiler}) || TakasumiBOT`
              }
            }]
          });
        }catch{
          await interaction.editReply({
            embeds:[{
              color: Colors.Green,
              author:{
                name: "実行しました",
                icon_url: "https://cdn.takasumibot.com/images/system/success.png"
              },
              description: `**コード**\n\`\`\`${code}\`\`\`\n**結果**\n結果が長すぎた為添付ファイルに出力しました`,
              footer:{
                text: `${lang.name}(${lang.compiler}) || TakasumiBOT`
              }
            }],
            files:[
              new AttachmentBuilder()
                .setFile(Buffer.from(res.program_output,"UTF-8"))
                .setName("data.txt")
            ]
          });
        }
      }else{
        try{
          await interaction.editReply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "実行できませんでした",
                icon_url: "https://cdn.takasumibot.com/images/system/error.png"
              },
              description: `**コード**\n\`\`\`${code}\`\`\`\n**エラー**\n\`\`\`${res.compiler_error||res.program_error}\`\`\``,
              footer:{
                text: `${lang.name}(${lang.compiler}) || TakasumiBOT`
              }
            }]
          });
        }catch{
          await interaction.editReply({
            embeds:[{
              color: Colors.Red,
              author:{
                name: "実行できませんでした",
                icon_url: "https://cdn.takasumibot.com/images/system/error.png"
              },
              description: `**コード**\n\`\`\`${code}\`\`\`\n**エラー**\nエラーが長すぎる為添付ファイルに出力しました`,
              footer:{
                text: `${lang.name}(${lang.compiler}) || TakasumiBOT`
              }
            }],
            files:[
              new AttachmentBuilder()
                .setFile(Buffer.from(res.compiler_error||res.program_error,"UTF-8"))
                .setName("error.txt")
            ]
          });
        }
      }
    }catch(error){
      await interaction.editReply({
        embeds:[{
          color: Colors.Red,
          author:{
            name: "正常に実行できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          fields:[
            {
              name: "エラーコード",
              value: `\`\`\`${error}\`\`\``
            }
          ],
          footer:{
            text: `${lang.name}(${lang.compiler}) || TakasumiBOT`
          }
        }]
      });
    }
  }
}