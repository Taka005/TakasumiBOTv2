module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("script_")){
    const data = interaction.customId.split("_");
    const code = interaction.fields.getTextInputValue("code");

    const lang = {
      "JavaScript":{
        "type": "js",
        "compiler": "nodejs-16.14.0"
      },
      "Python":{
        "type": "py",
        "compiler": "cpython-3.10.2"
      },
      "Bash":{
        "type": "bash",
        "compiler": "bash"
      }
    }

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
          "compiler": lang[data[1]].compiler
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
              description: `**コード**\n\`\`\`${lang[data[1]].type}\n${code}\`\`\`\n**結果**\n\`\`\`${res.program_output||"なし"}\`\`\``,
              footer:{
                text: `${data[1]} || TakasumiBOT`
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
              description: `**コード**\n\`\`\`${lang[data[1]].type}\n${code}\`\`\`\n**結果**\n結果が長すぎた為添付ファイルに出力しました`,
              footer:{
                text: `${data[1]} || TakasumiBOT`
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
              description: `**コード**\n\`\`\`${lang[data[1]].type}\n${code}\`\`\`\n**エラー**\n\`\`\`${res.program_error}\`\`\``,
              footer:{
                text: `${data[1]} || TakasumiBOT`
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
              description: `**コード**\n\`\`\`${lang[data[1]].type}\n${code}\`\`\`\n**エラー**\nエラーが長すぎる為添付ファイルに出力しました`,
              footer:{
                text: `${data[1]} || TakasumiBOT`
              }
            }],
            files:[
              new AttachmentBuilder()
                .setFile(Buffer.from(res.program_error,"UTF-8"))
                .setName("error.txt")
            ]
          });
        }
      }
    }catch{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "正常に実行できませんでした",
            icon_url: "https://cdn.takasumibot.com/images/system/error.png"
          },
          color: Colors.Red,
          description: "実行がタイムアウトしました",
          footer:{
            text: `${data[1]} || TakasumiBOT`
          }
        }]
      });
    }
  }
}