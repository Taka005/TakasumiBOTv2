module.exports = async(interaction)=>{
  const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Colors } = require("discord.js");
  if(!interaction.isButton()) return;
  if(interaction.customId.startsWith("page")){

    const id = interaction.customId.split("_");
    if(await check(interaction,id[2])) return;

    //1ページ目
    if(interaction.customId.startsWith("page_1")){
      await interaction.message.edit({
        embeds:[{
          title: "HELP 基本コマンド",
          color: Colors.Green,
          fields:[
            {
              name: "/poll",
              value: "アンケートを作成することができます\n最大で選択肢は8個までです"
            },
            {
              name: "/global",
              value: "色々なサーバーと繋がるグローバルチャットを有効、無効にします\n[利用規約](https://gc.taka.ml/)を読んでから使用してください"
            },
            {
              name: "/about",
              value: "BOTについての情報や、関連リンクを表示します"
            },
            {
              name: "/afk",
              value: "AFKを設定します(留守電の機能です)"
            },
            {
              name: "/follow",
              value: "BOTのアナウンスチャンネルを追加します"
            },
            {
              name: "/hiroyuki",
              value: "ひろゆきを召喚します"
            },
            {
              name: "/top",
              value: "実行したチャンネルの1番最初のメッセージを表示します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_5_${id[2]}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("1ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_2_${id[2]}`))
        ]
      })
      .then(async()=>{
        await interaction.deferUpdate({});
      })
      .catch(async(error)=>{
        await err(interaction,error)
      })
    }
    //2ページ目
    if(interaction.customId.startsWith("page_2")){
      await interaction.message.edit({
        embeds:[{
          title: "HELP 認証・情報コマンド",
          color: Colors.Green,
          fields:[
            {
              name: "/auth",
              value: "メンバー認証を設定します\n数種類の認証方式を設定できます"
            },
            {
              name: "/guideline",
              value: "サーバーのガイドラインを作成し、同意するとロールが付与されます"
            },
            {
              name: "/user",
              value: "指定されたユーザーを検索して表示します\n検索対象がサーバー内にいる場合は、詳しい情報まで取得可能です"
            },
            {
              name: "/server",
              value: "サーバーの情報を表示します"
            },
            {
              name: "/role",
              value: "指定した役職の情報を表示します"
            },
            {
              name: "/emoji",
              value: "指定した絵文字の情報を表示します"
            },
            {
              name: "/avatar",
              value: "指定されたユーザーのアイコンを表示します\n使い方は`/user`と同じです"
            },
            {
              name: "/permission",
              value: "指定されたユーザーの権限を表示します\n使い方は`/user`と同じです"
            },
            {
              name: "/inviter",
              value: "招待ランキングを表示します"
            },
            {
              name: "/invites",
              value: "サーバー又は指定したユーザーの招待一覧を表示します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_1_${id[2]}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("2ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_3_${id[2]}`))
        ]
      })
      .then(async()=>{
        await interaction.deferUpdate({});
      })
      .catch(async(error)=>{
        await err(interaction,error)
      })
    }
    //3ページ目
    if(interaction.customId.startsWith("page_3")){
      await interaction.message.edit({
        embeds:[{
          title: "HELP サーバー管理コマンド",
          color: Colors.Green,
          fields:[
            {
              name: "/ban",
              value: "指定されたメンバーをサーバーからBANすることができます"
            },
            {
              name: "/kick",
              value: "指定されたメンバーをサーバーからKICKすることができます"
            },
            {
              name: "/timeout",
              value: "指定されたメンバーをタイムアウトすることができます"
            },
            {
              name: "/warn",
              value: "指定されたメンバーを警告します\n ※メンバーがDMを拒否している場合警告できません"
            },
            {
              name: "/del",
              value: "指定された数だけ、メッセージを一括で削除します\n ※二週間前かつ、100個以上のメッセージは削除できません"
            },
            {
              name: "/embed",
              value: "埋め込みを簡単に作成し、表示できます\n※実行するには`メッセージの管理の権限が必要です`"
            },
            {
              name: "/panel",
              value: "役職パネルを作成します"
            },
            {
              name: "/colorrole",
              value: "色付きロールを簡単に作成します"
            },
            {
              name: "/ticket",
              value: "簡易的なお問合せ(チケット)機能が使えます"
            },
            {
              name: "/slowmode",
              value: "チャンネルに低速モードを設定します"
            },
            {
              name: "/moderate",
              value: "モデレート機能を設定します"
            },
            {
              name: "/setting",
              value: "サーバーの各種設定を変更します\n詳しくは`/setting help`を実行してください"
            },
            {
              name: "/invite",
              value: "カスタマイズされた招待リンクを作成します"
            },
            {
              name: "/export",
              value: "サーバーのデータをJSON形式に出力します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_2_${id[2]}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("3ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_4_${id[2]}`))
        ]
      })
      .then(async()=>{
        await interaction.deferUpdate({});
      })
      .catch(async(error)=>{
        await err(interaction,error)
      })
    }
    //4ページ目
    if(interaction.customId.startsWith("page_4")){
      await interaction.message.edit({
        embeds:[{
          title: "HELP ツールコマンド",
          color: Colors.Green,
          fields:[
            {
              name: "/wiki",
              value: "Wikipediaの検索をします"
            },
            {
              name: "/gif",
              value: "GIF画像を検索して表示します"
            },
            {
              name: "/translate",
              value: "テキストを翻訳します"
            },
            {
              name: "/mc",
              value: "指定したアドレスのMinecarftサーバーの情報を表示します"
            },
            {
              name: "/safeweb",
              value: "Webサイトの安全性を評価します"
            },
            {
              name: "/webshot",
              value: "Webサイトのスクリーンショットを撮影します"
            },
            {
              name: "/cipher",
              value: "文字列の暗号化、復号化します"
            },
            {
              name: "/hash",
              value: "指定した方式でテキストをハッシュ化します"
            },
            {
              name: "/short",
              value: "短縮URLを作成します"
            },
            {
              name: "/nslookup",
              value: "DNS情報を取得します"
            },
            {
              name: "/script",
              value: "プログラムを実行します"
            },
            {
              name: "/qr",
              value: "QRコードを生成、または読み取ります"
            },
            {
              name: "/npm",
              value: "NPMパッケージを検索、表示します"
            },
            {
              name: "/pypi",
              value: "PIPパッケージを検索、表示します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_3_${id[2]}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("4ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_5_${id[2]}`))
        ]
      })
      .then(async()=>{
        await interaction.deferUpdate({});
      })
      .catch(async(error)=>{
        await err(interaction,error)
      })
    }

    if(interaction.customId.startsWith("page_5")){
      await interaction.message.edit({
        embeds:[{
          title: "HELP ネタ・その他のコマンド",
          color: Colors.Green,
          fields:[ 
            {
              name: "/miq",
              value: "Make it a Quoteを生成します"
            },
            {
              name: "/5000",
              value: "5000兆円ジェネレーター"
            },
            {
              name: "/omikuji",
              value: "大吉や、凶、吉などのおみくじが引けます"
            },
            {
              name: "/news",
              value: "最近のニュースを表示します"
            },
            {
              name: "/faq",
              value: "よくある質問一覧を表示します"
            },
            {
              name: "/ad",
              value: "BOTの広告文を表示します"
            },
            {
              name: "/status",
              value: "BOTのサーバーの状態を表示します\n※異常かもと思った場合は、早急に報告してください"
            },
            {
              name: "/account",
              value: "登録されているアカウント情報を表示します"
            },
            {
              name: "/snowflake",
              value: "[Snowflake](https://discord.com/developers/docs/reference#snowflakes)を解析します"
            }
          ]
        }],
        components:[
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("前")
                .setCustomId(`page_4_${id[2]}`))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("5ページ")
                .setCustomId("page")
                .setDisabled(true))
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("次")
                .setCustomId(`page_1_${id[2]}`))
        ]
      })
      .then(async()=>{
        await interaction.deferUpdate({});
      })
      .catch(async(error)=>{
        await err(interaction,error)
      })
    }
  }
}

async function check(interaction,id){
  const { Colors } = require("discord.js");
  if(id !== interaction.user.id){
    await interaction.reply({
      embeds:[{
        author:{
          name: "ページを更新できませんでした",
          icon_url: "https://cdn.taka.ml/images/system/error.png"
        },
        color: Colors.Red,
        description: "このコマンドは別の人が操作しています"
      }],
      ephemeral: true
    });
    return true
  }
  return false
}

async function err(interaction,error){
  const { ButtonBuilder, ActionRowBuilder, Colors } = require("discord.js");
  
  await interaction.reply({
    embeds:[{
      author:{
        name: "ページを更新できませんでした",
        icon_url: "https://cdn.taka.ml/images/system/error.png"
      },
      color: Colors.Red,
      description: "BOTの権限が不足しています",
      fields:[
        {
          name: "エラーコード",
          value: `\`\`\`${error}\`\`\``
        }
      ]
    }],
    components:[
      new ActionRowBuilder()
        .addComponents( 
          new ButtonBuilder()
            .setLabel("サポートサーバー")
            .setURL("https://discord.gg/NEesRdGQwD")
            .setStyle(ButtonStyle.Link))
    ],
    ephemeral: true
  });
}