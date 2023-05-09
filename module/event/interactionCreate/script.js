module.exports = async(interaction)=>{
  const fetch = require("node-fetch");
  const { AttachmentBuilder, Colors } = require("discord.js");
  if(!interaction.isModalSubmit()) return;
  if(interaction.customId.startsWith("script_")){
    const lang = interaction.customId.split("_");
    const code = interaction.fields.getTextInputValue("code");
  
    const language = {
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
    };

    await interaction.deferReply();

    let timeouted = false;
    const timeout = setTimeout(async()=>{
      timeouted = true;
      await interaction.editReply({
        embeds:[{
          author:{
            name: "正常に実行できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: "実行がタイムアウトしました",
          footer:{
            text: `${lang[1]} || TakasumiBOT`
          }
        }]
      });
    },3000);

    const res = await fetch("https://wandbox.org/api/compile.json",{
      method: "POST",
      header: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        "code": code,
        "compiler": language[lang[1]].compiler
      })
    }).then(res=>res.json());

    if(timeouted) return;
    clearTimeout(timeout);
    
    if(res.status === "0"){
      await interaction.editReply({
        embeds:[{
          color: Colors.Green,
          author:{
            name: "実行しました",
            icon_url: "https://cdn.taka.ml/images/system/success.png"
          },
          description: `**コード**\n\`\`\`${language[lang[1]].type}\n${code}\`\`\`\n**結果**\n\`\`\`${res.program_output||"なし"}\`\`\``,
          footer:{
            text: `${lang[1]} || TakasumiBOT`
          }
        }]
      }).catch(async()=>{
        await interaction.editReply({
          embeds:[{
            author:{
              name: "実行しました",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Green,
            description: `**コード**\n\`\`\`${language[lang[1]].type}\n${code}\`\`\`\n**結果**\n結果が長すぎた為添付ファイルに出力しました`,
            footer:{
              text: `${lang[1]} || TakasumiBOT`
            }
          }],
          files:[
            new AttachmentBuilder() 
              .setFile(new Buffer.from(res.program_output,"UTF-8")) 
              .setName("data.txt")
          ] 
        });
      })
    }else{
      await interaction.editReply({
        embeds:[{
          author:{
            name: "実行できませんでした",
            icon_url: "https://cdn.taka.ml/images/system/error.png"
          },
          color: Colors.Red,
          description: `**コード**\n\`\`\`${language[lang[1]].type}\n${code}\`\`\`\n**エラー**\n\`\`\`${res.program_error}\`\`\``,
          footer:{
            text: `${lang[1]} || TakasumiBOT`
          }
        }]
      }).catch(async()=>{
        await interaction.editReply({
          embeds:[{
            author:{
              name: "実行できませんでした",
              icon_url: "https://cdn.taka.ml/images/system/error.png"
            },
            color: Colors.Red,
            description: `**コード**\n\`\`\`${language[lang[1]].type}\n${code}\`\`\`\n**エラー**\nエラーが長すぎる為添付ファイルに出力しました`,
            footer:{
              text: `${lang[1]} || TakasumiBOT`
            }
          }],
          files: [
            new AttachmentBuilder() 
              .setFile(new Buffer.from(res.program_error,"UTF-8")) 
              .setName("error.txt")
          ] 
        });
      })
    }
  }
}