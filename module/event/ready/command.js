module.exports = async(client)=>{
  const config = require("../../../config.json"); 
  require("dotenv").config();
  const { SlashCommandBuilder, ContextMenuCommandBuilder, Colors } = require("discord.js");
  const { REST } = require("@discordjs/rest");
  const { Routes, ApplicationCommandType } = require("discord-api-types/v10");
    
  const rest = new REST({version:"10"})
    .setToken(process.env.BOT_TOKEN);
            
  await rest.put(
    Routes.applicationCommands(client.application.id),
      { 
        body: [
          //Slashcommand
          //5000
          new SlashCommandBuilder()
            .setName("5000")
            .setDescription("5000兆円ジェネレーター")
            .addStringOption(option =>
              option
                .setName("top")
                .setDescription("上部文字列")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("bottom")
                .setDescription("下部文字列")),
          //about
          new SlashCommandBuilder()
            .setName("about")
            .setDescription("このBOTについての情報や、関連リンクを表示します"),
          //account
          new SlashCommandBuilder()
            .setName("account")
            .setDescription("登録されているアカウント情報を表示します"),
          //ad
          new SlashCommandBuilder()
            .setName("ad")
            .setDescription("BOTの広告を表示します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("表示内容を変更します")
                .setRequired(true)
                .addChoices(
                  { name: "ノーマル", value: "normal" },
                  { name: "シンプル", value: "simple" }
                )),
          //afk
          new SlashCommandBuilder()
            .setName("afk")
            .setDescription("AFKを設定します(留守電)")
            .addStringOption(option =>
              option
                .setName("message")
                .setDescription("代わりに送信するメッセージ")),
          //auth
          new SlashCommandBuilder()
            .setName("auth")
            .setDescription("メンバー認証を設定します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("認証方式を設定します")
                .setRequired(true)
                .addChoices(
                  { name: "標準", value: "normal" },
                  { name: "計算", value: "panel" },
                  { name: "画像", value: "image" },
                  { name: "Web", value: "web" },
                ))
            .addRoleOption(option =>
              option
                .setName("role")
                .setDescription("認証成功時に付与するロール")
                .setRequired(true)),
          //avatar
          new SlashCommandBuilder()
            .setName("avatar")
            .setDescription("ユーザーのアバターを表示します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("ユーザーID又はメンション")),
          //ban
          new SlashCommandBuilder()
            .setName("ban")
            .setDescription("ユーザーをサーバーからBANします")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("ユーザーID又はメンション")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("理由"))
            .addIntegerOption(option =>
              option
                .setName("days")
                .setDescription("メッセージを削除する日数")),
          //cipher
          new SlashCommandBuilder()
            .setName("cipher")
            .setDescription("暗号を生成や、復号化をします")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("処理を選択します")
                .setRequired(true)
                .addChoices(
                  { name: "暗号化", value: "cipher" },
                  { name: "復号化", value: "decipher" }
                ))
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("対象の文字")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("key")
                .setDescription("復号鍵")
                .setRequired(true)),
          //colorrole
          new SlashCommandBuilder()
            .setName("colorrole")
            .setDescription("色付きロールを簡単に作成します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("ロールの名前")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("color")
                .setDescription("作成するロールの色")
                .setRequired(true)
                .addChoices(
                  { name: "デフォルト", value: Colors.Default },
                  { name: "白", value: Colors.White },
                  { name: "緑", value: Colors.Green },
                  { name: "青", value: Colors.Blue },
                  { name: "黄", value: Colors.Yellow },
                  { name: "紫", value: Colors.Purple },
                  { name: "金", value: Colors.Gold },
                  { name: "橙", value: Colors.Orange },
                  { name: "赤", value: Colors.Red },
                  { name: "水", value: Colors.Aqua },
                )),
          //debug
          new SlashCommandBuilder()
            .setName("debug")
            .setDescription("デバッグ機能を使用します") 
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("デバッグの種類")
                .setRequired(true)
                .addChoices(
                  { name: "内容", value: "content" },
                  { name: "送信", value: "send" },
                  { name: "編集", value: "edit" },
                  { name: "削除", value: "delete" }
                ))
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("メッセージID"))
            .addChannelOption(option =>
              option
                .setName("channel")
                .setDescription("取得するチャンネル"))
            .addStringOption(option =>
              option
                .setName("json")
                .setDescription("送信するオブジェクト")),
          //del
          new SlashCommandBuilder()
            .setName("del")
            .setDescription("メッセージを一括で削除します")
            .addIntegerOption(option =>
              option
                .setName("number")
                .setDescription("削除数")
                .setRequired(true))
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("削除するユーザー")),
          //embed
          new SlashCommandBuilder()
            .setName("embed")
            .setDescription("簡単に埋め込みメッセージを作成します"),
          //emoji
          new SlashCommandBuilder()
            .setName("emoji")
            .setDescription("指定した絵文字の情報を表示します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("表示する絵文字")
                .setRequired(true)),
          //export
          new SlashCommandBuilder()
            .setName("export")
            .setDescription("サーバーの情報をJSON形式に出力します"),
          //faq
          new SlashCommandBuilder()
            .setName("faq")
            .setDescription("よくある質問一覧を表示します"),
          //follow
          new SlashCommandBuilder()
            .setName("follow")
            .setDescription("BOTのアナウンスチャンネルを追加します"),
          //gif
          new SlashCommandBuilder()
            .setName("gif")
            .setDescription("GIF画像を検索して、表示します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("検索ワード")
                .setRequired(true)),
          //global
          new SlashCommandBuilder()
            .setName("global")
            .setDescription("グローバルチャットの切り替え"),
          //guideline
          new SlashCommandBuilder()
            .setName("guideline")
            .setDescription("サーバーのガイドラインを作成します")
            .addRoleOption(option =>
              option
                .setName("role")
                .setDescription("同意時に付与するロール")
                .setRequired(true)),
          //hash
          new SlashCommandBuilder()
            .setName("hash")
            .setDescription("指定した方式でテキストをハッシュ化します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("ハッシュ化するテキスト")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("ハッシュの種類")
                .setRequired(true)
                .addChoices(
                  { name: "SHA224", value: "sha224" },
                  { name: "SHA256", value: "sha256" },
                  { name: "SHA384", value: "sha384" },
                  { name: "SHA512", value: "sha512" }
                )),
          //help
          new SlashCommandBuilder()
            .setName("help")
            .setDescription("使い方を表示します")
            .addStringOption(option =>
              option
                .setName("command")
                .setDescription("表示するコマンド名")),
          //hiroyuki
          new SlashCommandBuilder()
            .setName("hiroyuki")
            .setDescription("ひろゆきを召喚、退出します"),
          //invite
          new SlashCommandBuilder()
            .setName("invite")
            .setDescription("招待リンクを作成します")
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("有効な秒数(0で無限)")
                .setRequired(true))  
            .addIntegerOption(option =>
              option
                .setName("use")
                .setDescription("使用回数(0で無限)")
                .setRequired(true)),
          //inviter
          new SlashCommandBuilder()
            .setName("inviter")
            .setDescription("招待ランキングを表示します"),
          //invites
          new SlashCommandBuilder()
            .setName("invites")
            .setDescription("サーバー又は指定したユーザーの招待一覧を表示します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("表示するユーザー")),
          //kick
          new SlashCommandBuilder()
            .setName("kick")
            .setDescription("メンバーをサーバーからKICKします")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("KICK対象のメンバー")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("理由")),
          //mc
          new SlashCommandBuilder()
            .setName("mc")
            .setDescription("マインクラフトサーバーの情報を検索します")
            .addStringOption(option =>
              option
                .setName("edition")
                .setDescription("エディション")
                .setRequired(true)
                .addChoices(
                  { name: "Java版", value: "je" },
                  { name: "統合版", value: "be" }
                ))
            .addStringOption(option =>
              option
                .setName("ip")
                .setDescription("検索するサーバーのアドレス")
                .setRequired(true)),
          //miq
          new SlashCommandBuilder()
            .setName("miq")
            .setDescription("Make it a Quoteを生成します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("表示するテキスト")
                .setRequired(true)),
          //moderate
          new SlashCommandBuilder()
            .setName("moderate")
            .setDescription(" モデレート機能を設定します")  
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("モデレートの強度")
                .setRequired(true)
                .addChoices(
                  { name: "高い", value: "high" },
                  { name: "標準", value: "normal" },
                  { name: "低い", value: "low" },
                  { name: "オフ", value: "off" }
                )),
          //news
          new SlashCommandBuilder()
            .setName("news")
            .setDescription("最近のニュースを表示します"),
          //npm
          new SlashCommandBuilder()
            .setName("npm")
            .setDescription("NPMパッケージを検索します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("検索ワード")
                .setRequired(true)),
          //nslookup
          new SlashCommandBuilder()
            .setName("nslookup")
            .setDescription("DNS情報を取得します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("取得するアドレス")
                .setRequired(true)),
          //omikuji
          new SlashCommandBuilder()
            .setName("omikuji")
            .setDescription("おみくじを引きます"),
          //panel
          new SlashCommandBuilder()
            .setName("panel")
            .setDescription("役職パネルを作成します")  
            .addRoleOption(option =>
              option
                .setName("role_1")
                .setDescription("役職1")
                .setRequired(true))
            .addRoleOption(option =>
              option
                .setName("role_2")
                .setDescription("役職2"))
            .addRoleOption(option =>
              option
                .setName("role_3")
                .setDescription("役職3"))
            .addRoleOption(option =>
              option
                .setName("role_4")
                .setDescription("役職4"))
            .addRoleOption(option =>
              option
                .setName("role_5")
                .setDescription("役職5"))
            .addRoleOption(option =>
              option
                .setName("role_6")
                .setDescription("役職6"))
            .addRoleOption(option =>
              option
                .setName("role_7")
                .setDescription("役職7"))
            .addRoleOption(option =>
              option
                .setName("role_8")
                .setDescription("役職8"))
            .addStringOption(option =>
              option
                .setName("title")
                .setDescription("タイトル")),
          //permission
          new SlashCommandBuilder()
            .setName("permission")
            .setDescription("指定したユーザーの権限を表示します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("権限を表示するユーザー")),
          //poll
          new SlashCommandBuilder()
            .setName("poll")
            .setDescription("アンケート機能です")
            .addStringOption(option =>
              option
                .setName("title")
                .setDescription("タイトル")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_1")
                .setDescription("選択1")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_2")
                .setDescription("選択2")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_3")
                .setDescription("選択3"))
            .addStringOption(option =>
              option
                .setName("select_4")
                .setDescription("選択4"))
            .addStringOption(option =>
              option
                .setName("select_5")
                .setDescription("選択5"))
            .addStringOption(option =>
              option
                .setName("select_6")
                .setDescription("選択6"))
            .addStringOption(option =>
              option
                .setName("select_7")
                .setDescription("選択7"))
            .addStringOption(option =>
              option
                .setName("select_8")
                .setDescription("選択8")),
          //pypi
          new SlashCommandBuilder()
            .setName("pypi")
            .setDescription("PIPパッケージを検索します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("検索ワード")
                .setRequired(true)),
          //qr
          new SlashCommandBuilder()
            .setName("qr")
            .setDescription("QRコードを読み取り又は、生成します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("処理を選択します")
                .setRequired(true)
                .addChoices(
                  { name: "読み込む(URL)", value: "read" },
                  { name: "生成(文字列)", value: "gen" }
                ))
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("文字列又は、URL")
                .setRequired(true)),
          //reload
          new SlashCommandBuilder()
            .setName("reload")
            .setDescription("BOTのリロードをします"),
          //role
          new SlashCommandBuilder()
            .setName("role")
            .setDescription("役職の内容を表示します")
            .addRoleOption(option =>
              option
                .setName("name")
                .setDescription("表示するロール")
                .setRequired(true)),
          //safeweb
          new SlashCommandBuilder()
            .setName("safeweb")
            .setDescription("Webサイトの安全性を評価します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("対象のURL")
                .setRequired(true)),
          //script
          new SlashCommandBuilder()
            .setName("script")
            .setDescription("プログラムを実行します")
            .addStringOption(option =>
              option
                .setName("lang")
                .setDescription("実行する言語")
                .setRequired(true)
                .addChoices(
                  { name: "JavaScript", value: "JavaScript" },
                  { name: "Python", value: "Python" },
                  { name: "Bash", value: "Bash" }
                )),
          //server
          new SlashCommandBuilder()
            .setName("server")
            .setDescription("サーバーに関する情報を表示します"),
          //setting
          new SlashCommandBuilder()
            .setName("setting")
            .setDescription("サーバーの設定を変更します")
            .addSubcommand(subcommand =>
              subcommand
                .setName("help")
                .setDescription("設定のヘルプ画面を表示します"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("bump")
                .setDescription("BUMP時に通知するロールを設定します")
                .addRoleOption(option =>
                  option
                    .setName("role")
                    .setDescription("通知するロール(無効にする場合は入力しないでください")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("dissoku")
                .setDescription("Dissoku UP時に通知するロールを設定します")
                .addRoleOption(option =>
                  option
                    .setName("role")
                    .setDescription("通知するロール(無効にする場合は入力しないでください)")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("join")
                .setDescription("参加メッセージを設定します")
                .addStringOption(option =>
                    option
                      .setName("message")
                      .setDescription("送信するメッセージ")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("leave")
                .setDescription("退出メッセージを設定します")
                .addStringOption(option =>
                    option
                      .setName("message")
                      .setDescription("送信するメッセージ")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("ignore")
                .setDescription("Bump通知、Dissoku通知、メッセージ展開の無効化と有効化を切り替えます"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("info")
                .setDescription("データベースの設定状況を表示します"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("delete")
                .setDescription("データベースに登録されてるサーバーの情報を全て削除します")),
          //short
          new SlashCommandBuilder()
            .setName("short")
            .setDescription("短縮URLを作成します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("短縮するURL")
                .setRequired(true)),
          //slowmode
          new SlashCommandBuilder()
            .setName("slowmode")
            .setDescription("チャンネルに低速モードを設定します")
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("設定する秒数")
                .setRequired(true)),
          //snowflake
          new SlashCommandBuilder()
            .setName("snowflake")
            .setDescription("Snowflakeを解析します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("解析するID")
                .setRequired(true)),
          //status
          new SlashCommandBuilder()
            .setName("status")
            .setDescription("BOTの状態を表示します"),
          //system
          new SlashCommandBuilder()
            .setName("system")
            .setDescription("BOTの管理をします")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("操作")
                .setRequired(true)
                .addChoices(
                  { name: "脱退", value: "leave" },
                  { name: "削除", value: "delete" },
                  { name: "ミュート/解除(サーバー)", value: "mute_server" },
                  { name: "ミュート/解除(ユーザー)", value: "mute_user" },
                  { name: "DM", value: "dm" }
                ))
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("操作する対象のID")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("message")
                .setDescription("メッセージ/理由")),
          //ticket
          new SlashCommandBuilder()
            .setName("ticket")
            .setDescription("簡易的なお問い合わせ機能です"),
          //timeout
          new SlashCommandBuilder()
            .setName("timeout")
            .setDescription("ユーザーをタイムアウトします")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("ユーザーID又はメンション")
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("時間(秒)"))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("理由")),
          //top
          new SlashCommandBuilder()
            .setName("top")
            .setDescription("実行したチャンネルの1番最初のメッセージのリンクを表示します"),
          //translate
          new SlashCommandBuilder()
            .setName("translate")
            .setDescription("テキストを翻訳します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("翻訳対象のテキスト")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("lang")
                .setDescription("翻訳先になる言語")
                .setRequired(true)
                .addChoices(
                  { name: "日本語", value: "ja" },
                  { name: "英語", value: "en" },
                  { name: "韓国語", value: "ko" },
                  { name: "中国語", value: "zh" },
                  { name: "ロシア語", value: "ru" },
                  { name: "フランス語", value: "fr" },
                  { name: "ドイツ語", value: "de" }
                )),
          //user
          new SlashCommandBuilder()
            .setName("user")
            .setDescription("指定したユーザーの情報を表示します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("ユーザーID又はメンション")),
          //warn
          new SlashCommandBuilder()
            .setName("warn")
            .setDescription("指定したメンバーを警告します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("警告対象のメンバー")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("理由")
                .setRequired(true)),
          //webshot
          new SlashCommandBuilder()
            .setName("webshot")
            .setDescription("Webサイトのスクリーンショットを撮影します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("対象のURL")
                .setRequired(true)),
          //wiki
          new SlashCommandBuilder()
            .setName("wiki")
            .setDescription("wikipediaで検索して、表示します")
            .addStringOption(option =>
              option
                .setName("word")
                .setDescription("検索ワード")
                .setRequired(true)),
          //ContextMenu
          //avatar
          new ContextMenuCommandBuilder()
            .setName("アバターを表示")
            .setType(ApplicationCommandType.User),
          //member
          new ContextMenuCommandBuilder()
            .setName("メンバー情報を表示")
            .setType(ApplicationCommandType.User),
          //permission
          new ContextMenuCommandBuilder()
            .setName("権限を表示")
            .setType(ApplicationCommandType.User),
          //pin
          new ContextMenuCommandBuilder()
            .setName("メッセージをピン留め")
            .setType(ApplicationCommandType.Message),
          //quote
          new ContextMenuCommandBuilder()
            .setName("Make it a Quote")
            .setType(ApplicationCommandType.Message),
          //to_en
          new ContextMenuCommandBuilder()
            .setName("英語に翻訳")
            .setType(ApplicationCommandType.Message),
          //to_ja
          new ContextMenuCommandBuilder()
            .setName("日本語に翻訳")
            .setType(ApplicationCommandType.Message)
        ]
      }
  );

  await client.channels.cache.get(config.log).send("スラッシュコマンドをリロードしました");
}