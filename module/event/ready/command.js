module.exports = async(client)=>{
  require("dotenv").config();
  const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, REST, Colors, Routes } = require("discord.js");
  const config = require("../../../config.json");

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
            .setDescription("500 trillion yen generator")
            .setDescriptionLocalization("ja","5000兆円ジェネレーター")
            .addStringOption(option =>
              option
                .setName("top")
                .setDescription("Upper Text")
                .setDescriptionLocalization("ja","上の文字")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("bottom")
                .setDescription("Lower text")
                .setDescriptionLocalization("ja","下の文字")
                .setRequired(true)),
          //about
          new SlashCommandBuilder()
            .setName("about")
            .setDescription("View information about the BOT and related links")
            .setDescriptionLocalization("ja","BOTについての情報や関連リンクを表示します"),
          //account
          new SlashCommandBuilder()
            .setName("account")
            .setDescription("View registered account information")
            .setDescriptionLocalization("ja","登録されているアカウント情報を表示します"),
          //activity
          new SlashCommandBuilder()
            .setName("activity")
            .setDescription("View people whose activity is the same as you")
            .setDescriptionLocalization("ja","自分と同じアクティビティの人を表示します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Activity Name")
                .setDescriptionLocalization("ja","アクティビティの名前")
                .setAutocomplete(true)),
          //ad
          new SlashCommandBuilder()
            .setName("ad")
            .setDescription("View BOT ads")
            .setDescriptionLocalization("ja","BOTの広告を表示します"),
          //afk
          new SlashCommandBuilder()
            .setName("afk")
            .setDescription("Set the AFK")
            .setDescriptionLocalization("ja","AFKを設定します(留守電)")
            .addStringOption(option =>
              option
                .setName("message")
                .setDescription("Message")
                .setDescriptionLocalization("ja","伝言メッセージ")),
          //auth
          new SlashCommandBuilder()
            .setName("auth")
            .setDescription("Set up member authentication")
            .setDescriptionLocalization("ja","メンバー認証を設定します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Authentication methods")
                .setDescriptionLocalization("ja","認証方式")
                .setRequired(true)
                .addChoices(
                  { name: "標準", value: "normal" },
                  { name: "計算", value: "math" },
                  { name: "画像", value: "image" },
                  { name: "ウェブ", value: "web" },
                ))
            .addRoleOption(option =>
              option
                .setName("role")
                .setDescription("Give roll")
                .setDescriptionLocalization("ja","付与するロール")
                .setRequired(true)),
          //avatar
          new SlashCommandBuilder()
            .setName("avatar")
            .setDescription("View user icons")
            .setDescriptionLocalization("ja","ユーザーのアイコンを表示します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("User ID or Mention")
                .setDescriptionLocalization("ja","ユーザーID・メンション")),
          //ban
          new SlashCommandBuilder()
            .setName("ban")
            .setDescription("Ban the user from the server")
            .setDescriptionLocalization("ja","ユーザーをサーバーからBANします")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("User ID or Mention")
                .setDescriptionLocalization("ja","ユーザーID・メンション")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("Reason")
                .setDescriptionLocalization("ja","理由"))
            .addIntegerOption(option =>
              option
                .setName("days")
                .setDescription("Number of days to delete messages")
                .setDescriptionLocalization("ja","メッセージを削除する日数")),
          //button
          new SlashCommandBuilder()
            .setName("button")
            .setDescription("Generate button for URL")
            .setDescriptionLocalization("ja","URLのボタンを生成します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Button Name")
                .setDescriptionLocalization("ja","ボタンの名前")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("Button URL")
                .setDescriptionLocalization("ja","ボタンのURL")
                .setRequired(true)),
          //channel
          new SlashCommandBuilder()
            .setName("channel")
            .setDescription("View information on the specified channel")
            .setDescriptionLocalization("ja","指定したチャンネルの情報を表示します")
            .addChannelOption(option =>
              option
                .setName("name")
                .setDescription("Channel Name")
                .setDescriptionLocalization("ja","チャンネル名")
                .setRequired(true)),
          //cipher
          new SlashCommandBuilder()
            .setName("cipher")
            .setDescription("Generate and decrypt ciphers")
            .setDescriptionLocalization("ja","暗号を生成・復号します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Processing method")
                .setDescriptionLocalization("ja","処理方式")
                .setRequired(true)
                .addChoices(
                  { name: "暗号化", value: "cipher" },
                  { name: "復号化", value: "decipher" }
                ))
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text to process")
                .setDescriptionLocalization("ja","処理するテキスト")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("key")
                .setDescription("Key")
                .setDescriptionLocalization("ja","鍵")
                .setRequired(true)),
          //colorrole
          new SlashCommandBuilder()
            .setName("colorrole")
            .setDescription("Create a colored roll")
            .setDescriptionLocalization("ja","色付きロールを作成します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Role Name")
                .setDescriptionLocalization("ja","ロールの名前")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("color")
                .setDescription("Role Color")
                .setDescriptionLocalization("ja","ロールの色")
                .setRequired(true)
                .addChoices(
                  { name: "白", value: `${Colors.White}` },
                  { name: "緑", value: `${Colors.Green}` },
                  { name: "青", value: `${Colors.Blue}` },
                  { name: "黄", value: `${Colors.Yellow}` },
                  { name: "紫", value: `${Colors.Purple}` },
                  { name: "金", value: `${Colors.Gold}` },
                  { name: "橙", value: `${Colors.Orange}` },
                  { name: "赤", value: `${Colors.Red}` }
                )),
          //db
          new SlashCommandBuilder()
            .setName("db")
            .setDescription("Send a query to the database")
            .setDescriptionLocalization("ja","データベースにクエリを送信します")
            .addStringOption(option =>
              option
                .setName("query")
                .setDescription("Query")
                .setDescriptionLocalization("ja","クエリ")
                .setRequired(true)),
          //debug
          new SlashCommandBuilder()
            .setName("debug")
            .setDescription("Use the debug function")
            .setDescriptionLocalization("ja","デバッグ機能を使用します") 
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
                .setDescription("チャンネル"))
            .addStringOption(option =>
              option
                .setName("json")
                .setDescription("JSON")),
          //del
          new SlashCommandBuilder()
            .setName("del")
            .setDescription("Delete messages in bulk")
            .setDescriptionLocalization("ja","メッセージを一括で削除します")
            .addIntegerOption(option =>
              option
                .setName("number")
                .setDescription("Number of deletions")
                .setDescriptionLocalization("ja","削除数")
                .setRequired(true))
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("User to delete")
                .setDescriptionLocalization("ja","削除するユーザー")),
          //embed
          new SlashCommandBuilder()
            .setName("embed")
            .setDescription("Create an embedded message")
            .setDescriptionLocalization("ja","埋め込みメッセージを作成します"),
          //emoji
          new SlashCommandBuilder()
            .setName("emoji")
            .setDescription("Display emoji information")
            .setDescriptionLocalization("ja","絵文字の情報を表示します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Emoji Name")
                .setDescriptionLocalization("ja","絵文字名")
                .setRequired(true)),
          //enquete
          new SlashCommandBuilder()
            .setName("enquete")
            .setDescription("Create a Questionnaire")
            .setDescriptionLocalization("ja","アンケートを作成します")
            .addStringOption(option =>
              option
                .setName("title")
                .setDescription("Title")
                .setDescriptionLocalization("ja","タイトル")
                .setRequired(true)),
          //export
          new SlashCommandBuilder()
            .setName("export")
            .setDescription("Output guild information in JSON format")
            .setDescriptionLocalization("ja","サーバーの情報をJSON形式に出力します"),
          //faq
          new SlashCommandBuilder()
            .setName("faq")
            .setDescription("View a list of frequently asked questions")
            .setDescriptionLocalization("ja","よくある質問一覧を表示します"),
          //follow
          new SlashCommandBuilder()
            .setName("follow")
            .setDescription("Add Bot announcement channel")
            .setDescriptionLocalization("ja","BOTのアナウンスチャンネルを追加します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Type of Setting")
                .setDescriptionLocalization("ja","設定する種類")
                .setRequired(true)
                .addChoices(
                  { name: "アナウンス", value: "announce" },
                  { name: "変更ログ", value: "update" }
                )),
          //gif
          new SlashCommandBuilder()
            .setName("gif")
            .setDescription("Search and view GIF image")
            .setDescriptionLocalization("ja","GIF画像を検索し表示します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Search word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //globalchat
          new SlashCommandBuilder()
            .setName("globalchat")
            .setDescription("Unavailable")
            .setDescriptionLocalization("ja","グローバルチャットを利用します"),
          //guess
          new SlashCommandBuilder()
            .setName("guess")
            .setDescription("Use your money to play a number guessing game")
            .setDescriptionLocalization("ja","所持金を使って数字当てゲームをします")  
            .addIntegerOption(option =>
              option
                .setName("money")
                .setDescription("Amount to bet")
                .setDescriptionLocalization("ja","賭ける金額")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("number")
                .setDescription("Number to choose")
                .setDescriptionLocalization("ja","選ぶ数")
                .setRequired(true)
                .addChoices(
                  { name: "1", value: "1" },
                  { name: "2", value: "2" },
                  { name: "3", value: "3" }
                )),
          //guideline
          new SlashCommandBuilder()
            .setName("guideline")
            .setDescription("Create server guidelines")
            .setDescriptionLocalization("ja","サーバーのガイドラインを作成します")
            .addRoleOption(option =>
              option
                .setName("role")
                .setDescription("Give Roll")
                .setDescriptionLocalization("ja","付与するロール")
                .setRequired(true)),
          //hash
          new SlashCommandBuilder()
            .setName("hash")
            .setDescription("Generate a hash")
            .setDescriptionLocalization("ja","ハッシュを生成します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text to hash")
                .setDescriptionLocalization("ja","ハッシュ化するテキスト")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Hash method")
                .setDescriptionLocalization("ja","ハッシュ方式")
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
            .setDescription("View how to use")
            .setDescriptionLocalization("ja","使い方を表示します")
            .addStringOption(option =>
              option
                .setName("command")
                .setDescription("Command name to view")
                .setDescriptionLocalization("ja","表示するコマンド名")
                .setAutocomplete(true)),
          //hiroyuki
          new SlashCommandBuilder()
            .setName("hiroyuki")
            .setDescription("Unavailable")
            .setDescriptionLocalization("ja","ひろゆきを参加・退出させます"),
          //invite
          new SlashCommandBuilder()
            .setName("invite")
            .setDescription("Create an invite link")
            .setDescriptionLocalization("ja","招待リンクを作成します")
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("Expiration date(0 for infinite)")
                .setDescriptionLocalization("ja","有効期限(0で無限)")
                .setRequired(true))  
            .addIntegerOption(option =>
              option
                .setName("use")
                .setDescription("Number of times used (0 for infinite)")
                .setDescriptionLocalization("ja","使用回数(0で無限)")
                .setRequired(true)),
          //inviter
          new SlashCommandBuilder()
            .setName("inviter")
            .setDescription("View invite ranking")
            .setDescriptionLocalization("ja","招待ランキングを表示します"),
          //invites
          new SlashCommandBuilder()
            .setName("invites")
            .setDescription("View a list of server and user invite")
            .setDescriptionLocalization("ja","サーバーやユーザーの招待一覧を表示します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("Users to view")
                .setDescriptionLocalization("ja","表示するユーザー")),
          //kick
          new SlashCommandBuilder()
            .setName("kick")
            .setDescription("Kick a member from the server")
            .setDescriptionLocalization("ja","メンバーをサーバーからキックします")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("Kick target member")
                .setDescriptionLocalization("ja","キックするメンバー")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("Reason")
                .setDescriptionLocalization("ja","理由")),
          //leaderboard
          new SlashCommandBuilder()
            .setName("leaderboard")
            .setDescription("View the ranking of the richest people.")
            .setDescriptionLocalization("ja","お金持ちランキングを表示します"),
          //log
          new SlashCommandBuilder()
            .setName("log")
            .setDescription("Outputs chat logs")
            .setDescriptionLocalization("ja","チャットの履歴を出力します")
            .addIntegerOption(option =>
              option
                .setName("format")
                .setDescription("Output format")
                .setDescriptionLocalization("ja","出力する形式")
                .setRequired(true)
                .addChoices(
                  { name: "JSON", value: "json" },
                  { name: "TEXT", value: "txt" }
                ))
            .addStringOption(option =>
              option
                .setName("limit")
                .setDescription("Obtain Number")
                .setDescriptionLocalization("ja","取得数")
                .setRequired(true)),
          //lottery
          new SlashCommandBuilder()
            .setName("lottery")
            .setDescription("Selects the specified number of people from the members with the specified role")
            .setDescriptionLocalization("ja","指定したロールを持っているメンバーから指定した人数を選びます")
            .addIntegerOption(option =>
              option
                .setName("number")
                .setDescription("Number of choices")
                .setDescriptionLocalization("ja","選ぶ人数")
                .setRequired(true))
            .addRoleOption(option =>
              option
                .setName("role")
                .setDescription("Target Role")
                .setDescriptionLocalization("ja","対象のロール")
                .setRequired(true)),
          //math
          new SlashCommandBuilder()
            .setName("math")
            .setDescription("Calculate the formula")
            .setDescriptionLocalization("ja","式を計算します")  
            .addStringOption(option =>
              option
                .setName("code")
                .setDescription("Formula")
                .setDescriptionLocalization("ja","計算式")
                .setRequired(true)),
          //mc
          new SlashCommandBuilder()
            .setName("mc")
            .setDescription("View information about the Minecraft server")
            .setDescriptionLocalization("ja","マインクラフトサーバーの情報を表示します")
            .addStringOption(option =>
              option
                .setName("edition")
                .setDescription("Edition")
                .setDescriptionLocalization("ja","エディション")
                .setRequired(true)
                .addChoices(
                  { name: "Java Edition", value: "je" },
                  { name: "BedRock Edition", value: "be" }
                ))
            .addStringOption(option =>
              option
                .setName("ip")
                .setDescription("Server Address")
                .setDescriptionLocalization("ja","サーバーアドレス")
                .setRequired(true)),
          //miq
          new SlashCommandBuilder()
            .setName("miq")
            .setDescription("Generate Make it a Quote")
            .setDescriptionLocalization("ja","Make it a Quoteを生成します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Type")
                .setDescriptionLocalization("ja","生成する種類")
                .setRequired(true)
                .addChoices(
                  { name: "標準", value: "normal" },
                  { name: "カラー", value: "color" },
                  { name: "位置反転", value: "reverse" },
                  { name: "色反転", value: "white" },
                  { name: "位置反転・カラー", value: "reverseColor"},
                  { name: "位置反転・色反転", value: "reverseWhite" }
            ))
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text to view")
                .setDescriptionLocalization("ja","表示するテキスト")
                .setRequired(true)),
          //moderate
          new SlashCommandBuilder()
            .setName("moderate")
            .setDescription("Set the moderating function")
            .setDescriptionLocalization("ja","AutoModを使用したモデレート機能を設定します")  
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Strength")
                .setDescriptionLocalization("ja","設定する機能")
                .setRequired(true)
                .addChoices(
                  { name: "スパム", value: "spam" },
                  { name: "メンションスパム", value: "mention" },
                  { name: "招待リンク", value: "invite" },
                  { name: "リンク", value: "link" },
                  { name: "大文字スパム", value: "capital"},
                  { name: "トークン", value: "token" },
                  { name: "リセット", value: "reset" }
                )),
          //money
          new SlashCommandBuilder()
            .setName("money")
            .setDescription("Check the user's money")
            .setDescriptionLocalization("ja","ユーザーの所持金を確認します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("Target User")
                .setDescriptionLocalization("ja","対象のユーザー")),
          //news
          new SlashCommandBuilder()
            .setName("news")
            .setDescription("View News")
            .setDescriptionLocalization("ja","ニュースを表示します"),
          //npm
          new SlashCommandBuilder()
            .setName("npm")
            .setDescription("Search the NPM package")
            .setDescriptionLocalization("ja","NPMパッケージを検索します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Search word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //nslookup
          new SlashCommandBuilder()
            .setName("nslookup")
            .setDescription("Get DNS information")
            .setDescriptionLocalization("ja","DNS情報を取得します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Address to be retrieved")
                .setDescriptionLocalization("ja","取得するアドレス")
                .setRequired(true)),
          //omikuji
          new SlashCommandBuilder()
            .setName("omikuji")
            .setDescription("Unavailable")
            .setDescriptionLocalization("ja","おみくじを引きます"),
          //panel
          new SlashCommandBuilder()
            .setName("panel")
            .setDescription("Create a role grant panel")
            .setDescriptionLocalization("ja","役職パネルを作成します")  
            .addRoleOption(option =>
              option
                .setName("role_1")
                .setDescription("Role1")
                .setDescriptionLocalization("ja","役職1")
                .setRequired(true))
            .addRoleOption(option =>
              option
                .setName("role_2")
                .setDescription("Role2")
                .setDescriptionLocalization("ja","役職2"))
            .addRoleOption(option =>
              option
                .setName("role_3")
                .setDescription("Role3")
                .setDescriptionLocalization("ja","役職3"))
            .addRoleOption(option =>
              option
                .setName("role_4")
                .setDescription("Role4")
                .setDescriptionLocalization("ja","役職4"))
            .addRoleOption(option =>
              option
                .setName("role_5")
                .setDescription("Role5")
                .setDescriptionLocalization("ja","役職5"))
            .addRoleOption(option =>
              option
                .setName("role_6")
                .setDescription("Role6")
                .setDescriptionLocalization("ja","役職6"))
            .addRoleOption(option =>
              option
                .setName("role_7")
                .setDescription("Role7")
                .setDescriptionLocalization("ja","役職7"))
            .addRoleOption(option =>
              option
                .setName("role_8")
                .setDescription("Role8")
                .setDescriptionLocalization("ja","役職8"))
            .addStringOption(option =>
              option
                .setName("title")
                .setDescription("Title")
                .setDescriptionLocalization("ja","タイトル")),
          //pay
          new SlashCommandBuilder()
            .setName("pay")
            .setDescription("Use your money to buy function")
            .setDescriptionLocalization("ja","所持金を使用して機能を購入します")  
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Function to buy")
                .setDescriptionLocalization("ja","買う機能")
                .setRequired(true)
                .addChoices(
                  { name: "一回10円: グローバルチャットの表示色(黄色)", value: "yellow" },
                  { name: "一回100円: グローバルチャットの表示色(赤色)", value: "red" }
                ))
            .addIntegerOption(option =>
              option
                .setName("count")
                .setDescription("Number of times to buy")
                .setDescriptionLocalization("ja","買う回数")
                .setRequired(true)),
          //permission
          new SlashCommandBuilder()
            .setName("permission")
            .setDescription("View user permissions")
            .setDescriptionLocalization("ja","ユーザーの権限を表示します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("User to view")
                .setDescriptionLocalization("ja","表示するユーザー")),
          //poll
          new SlashCommandBuilder()
            .setName("poll")
            .setDescription("Create a Poll")
            .setDescriptionLocalization("ja","投票を作成します")
            .addStringOption(option =>
              option
                .setName("title")
                .setDescription("Title")
                .setDescriptionLocalization("ja","タイトル")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_1")
                .setDescription("Select1")
                .setDescriptionLocalization("ja","選択1")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_2")
                .setDescription("Select2")
                .setDescriptionLocalization("ja","選択2")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_3")
                .setDescription("Select3")
                .setDescriptionLocalization("ja","選択3"))
            .addStringOption(option =>
              option
                .setName("select_4")
                .setDescription("Select4")
                .setDescriptionLocalization("ja","選択4"))
            .addStringOption(option =>
              option
                .setName("select_5")
                .setDescription("Select5")
                .setDescriptionLocalization("ja","選択5"))
            .addStringOption(option =>
              option
                .setName("select_6")
                .setDescription("Select6")
                .setDescriptionLocalization("ja","選択6"))
            .addStringOption(option =>
              option
                .setName("select_7")
                .setDescription("Select7")
                .setDescriptionLocalization("ja","選択7"))
            .addStringOption(option =>
              option
                .setName("select_8")
                .setDescription("Select8")
                .setDescriptionLocalization("ja","選択8")),
          //pypi
          new SlashCommandBuilder()
            .setName("pypi")
            .setDescription("Search the PIP package")
            .setDescriptionLocalization("ja","PIPパッケージを検索します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("Search word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //qr
          new SlashCommandBuilder()
            .setName("qr")
            .setDescription("Read or generate a QR code")
            .setDescriptionLocalization("ja","QRコードを読み取り・生成します")
            .addStringOption(option =>
              option
                .setName("type")
                .setDescription("Type of operation")
                .setDescriptionLocalization("ja","実行する操作")
                .setRequired(true)
                .addChoices(
                  { name: "生成", value: "gen" },
                  { name: "読み取り", value: "read" }
                ))
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text or URL")
                .setDescriptionLocalization("ja","テキスト・URL")
                .setRequired(true)),
          //random
          new SlashCommandBuilder()
            .setName("random")
            .setDescription("Choose at random")
            .setDescriptionLocalization("ja","ランダムで選びます")
            .addStringOption(option =>
              option
                .setName("select_1")
                .setDescription("Select1")
                .setDescriptionLocalization("ja","選択1")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_2")
                .setDescription("Select2")
                .setDescriptionLocalization("ja","選択2")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("select_3")
                .setDescription("Select3")
                .setDescriptionLocalization("ja","選択3"))
            .addStringOption(option =>
              option
                .setName("select_4")
                .setDescription("Select4")
                .setDescriptionLocalization("ja","選択4"))
            .addStringOption(option =>
              option
                .setName("select_5")
                .setDescription("Select5")
                .setDescriptionLocalization("ja","選択5"))
            .addStringOption(option =>
              option
                .setName("select_6")
                .setDescription("Select6")
                .setDescriptionLocalization("ja","選択6"))
            .addStringOption(option =>
              option
                .setName("select_7")
                .setDescription("Select7")
                .setDescriptionLocalization("ja","選択7"))
            .addStringOption(option =>
              option
                .setName("select_8")
                .setDescription("Select8")
                .setDescriptionLocalization("ja","選択8"))
            .addStringOption(option =>
              option
                .setName("select_9")
                .setDescription("Select9")
                .setDescriptionLocalization("ja","選択9"))
            .addStringOption(option =>
              option
                .setName("select_10")
                .setDescription("Select10")
                .setDescriptionLocalization("ja","選択10")),
          //reload
          new SlashCommandBuilder()
            .setName("reload")
            .setDescription("Reload the BOT")
            .setDescriptionLocalization("ja","BOTのリロードをします"),
          //reset
          new SlashCommandBuilder()
            .setName("reset")
            .setDescription("Completely resets the executed channel")
            .setDescriptionLocalization("ja","実行したチャンネルを完全にリセットします"),
          //retranslate
          new SlashCommandBuilder()
            .setName("retranslate")
            .setDescription("Repeat translation 10 times in various languages")
            .setDescriptionLocalization("ja","様々な言語で翻訳を10回繰り返します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text")
                .setDescriptionLocalization("ja","再翻訳するテキスト")
                .setRequired(true)),
          //role
          new SlashCommandBuilder()
            .setName("role")
            .setDescription("View role information")
            .setDescriptionLocalization("ja","役職の内容を表示します")
            .addRoleOption(option =>
              option
                .setName("name")
                .setDescription("Role to view")
                .setDescriptionLocalization("ja","表示するロール")
                .setRequired(true)),
          //rolecount
            new SlashCommandBuilder()
              .setName("rolecount")
              .setDescription("Displays the number and percentage of people who have each role")
              .setDescriptionLocalization("ja","それぞれのロールを持っている人数と割合を表示します"),
          //safeweb
          new SlashCommandBuilder()
            .setName("safeweb")
            .setDescription("View Web site safety")
            .setDescriptionLocalization("ja","Webサイトの安全性を評価します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("Target URL")
                .setDescriptionLocalization("ja","対象のURL")
                .setRequired(true)),
          //script
          new SlashCommandBuilder()
            .setName("script")
            .setDescription("Execute the program")
            .setDescriptionLocalization("ja","プログラムを実行します")
            .addStringOption(option =>
              option
                .setName("lang")
                .setDescription("Languages to execute")
                .setDescriptionLocalization("ja","実行する言語")
                .setRequired(true)
                .addChoices(
                  { name: "JavaScript", value: "JavaScript" },
                  { name: "Python", value: "Python" },
                  { name: "Bash", value: "Bash" }
                )),
          //search
          new SlashCommandBuilder()
            .setName("search")
            .setDescription("Search and view on Yahoo")
            .setDescriptionLocalization("ja","Yahooで検索し表示します")
            .addStringOption(option =>
              option
                .setName("word")
                .setDescription("Search word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //server
          new SlashCommandBuilder()
            .setName("server")
            .setDescription("View guild information")
            .setDescriptionLocalization("ja","サーバーの情報を表示します"),
          //setting
          new SlashCommandBuilder()
            .setName("setting")
            .setDescription("Change the server settings")
            .setDescriptionLocalization("ja","サーバーの設定を変更します")
            .addSubcommand(subcommand =>
              subcommand
                .setName("help")
                .setDescription("View help for settings")
                .setDescriptionLocalization("ja","設定のヘルプを表示します"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("bump")
                .setDescription("Set role to be notified when BUMP")
                .setDescriptionLocalization("ja","BUMP時に通知するロールを設定します")
                .addRoleOption(option =>
                  option
                    .setName("role")
                    .setDescription("Roles to notify(do not enter if disabled)")
                    .setDescriptionLocalization("ja","通知するロール(無効にする場合は入力しないでください")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("dissoku")
                .setDescription("Set role to be notified when Dissoku UP")
                .setDescriptionLocalization("ja","Dissoku UP時に通知するロールを設定します")
                .addRoleOption(option =>
                  option
                    .setName("role")
                    .setDescription("Roles to notify(do not enter if disabled)")
                    .setDescriptionLocalization("ja","通知するロール(無効にする場合は入力しないでください)")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("join")
                .setDescription("Set a message when you join")
                .setDescriptionLocalization("ja","参加メッセージを設定します")
                .addStringOption(option =>
                    option
                      .setName("message")
                      .setDescription("Message to send")
                      .setDescriptionLocalization("ja","送信するメッセージ")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("leave")
                .setDescription("Set a message when you leave")
                .setDescriptionLocalization("ja","退出メッセージを設定します")
                .addStringOption(option =>
                    option
                      .setName("message")
                      .setDescription("Message to send")
                      .setDescriptionLocalization("ja","送信するメッセージ")))
            .addSubcommand(subcommand =>
              subcommand
                .setName("ignore")
                .setDescription("Disables any message-related functionality")
                .setDescriptionLocalization("ja","Bump通知・Dissoku通知・メッセージ展開の有効・無効を切り替えます"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("info")
                .setDescription("View database configuration status")
                .setDescriptionLocalization("ja","データベースの設定状況を表示します"))
            .addSubcommand(subcommand =>
              subcommand
                .setName("delete")
                .setDescription("Delete configuration information registered in the database")
                .setDescriptionLocalization("ja","データベースに登録されてるサーバーの情報を全て削除します")),
          //short
          new SlashCommandBuilder()
            .setName("short")
            .setDescription("Create a short URL")
            .setDescriptionLocalization("ja","短縮URLを作成します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("Target URL")
                .setDescriptionLocalization("ja","短縮するURL")
                .setRequired(true)),
          //skin
          new SlashCommandBuilder()
            .setName("skin")
            .setDescription("Search for a Minecraft skin")
            .setDescriptionLocalization("ja","マインクラフトのスキンを検索します")
            .addStringOption(option =>
              option
                .setName("name")
                .setDescription("User Name")
                .setDescriptionLocalization("ja","ユーザー名")
                .setRequired(true)),
          //slowmode
          new SlashCommandBuilder()
            .setName("slowmode")
            .setDescription("Set the channel to low-speed mode")
            .setDescriptionLocalization("ja","チャンネルに低速モードを設定します")
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("Seconds to set")
                .setDescriptionLocalization("ja","設定する秒数")
                .setRequired(true)),
          //snowflake
          new SlashCommandBuilder()
            .setName("snowflake")
            .setDescription("Analyze Snowflake")
            .setDescriptionLocalization("ja","Snowflakeを解析します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("Target ID")
                .setDescriptionLocalization("ja","解析するID")
                .setRequired(true)),
          //status
          new SlashCommandBuilder()
            .setName("status")
            .setDescription("View the status of the BOT")
            .setDescriptionLocalization("ja","BOTのステータスを表示します"),
          //system
          new SlashCommandBuilder()
            .setName("system")
            .setDescription("Manage BOT")
            .setDescriptionLocalization("ja","BOTの管理をします")
            .addStringOption(option =>
              option
                .setName("type")       
                .setDescription("操作")
                .setRequired(true)
                .addChoices(
                  { name: "金額", value: "money" },
                  { name: "脱退", value: "leave" },
                  { name: "グローバルチャットから削除", value: "delete" },
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
                .setDescription("メッセージ/理由/金額")),
          //ticket
          new SlashCommandBuilder()
            .setName("ticket")
            .setDescription("Create an inquiry function")
            .setDescriptionLocalization("ja","お問い合わせ機能を作成します"),
          //timeout
          new SlashCommandBuilder()
            .setName("timeout")
            .setDescription("Time out a member")
            .setDescriptionLocalization("ja","メンバーをタイムアウトします")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("User ID or Mention")
                .setDescriptionLocalization("ja","ユーザーID・メンション")
                .setRequired(true))
            .addIntegerOption(option =>
              option
                .setName("time")
                .setDescription("Time (seconds)")
                .setDescriptionLocalization("ja","時間(秒)"))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("Reason")
                .setDescriptionLocalization("ja","理由")),
          //top
          new SlashCommandBuilder()
            .setName("top")
            .setDescription("View a link to the first message of the channel")
            .setDescriptionLocalization("ja","チャンネルの最初のメッセージのリンクを表示します"),
          //translate
          new SlashCommandBuilder()
            .setName("translate")
            .setDescription("Translate the text")
            .setDescriptionLocalization("ja","テキストを翻訳します")
            .addStringOption(option =>
              option
                .setName("text")
                .setDescription("Text to translate")
                .setDescriptionLocalization("ja","翻訳するテキスト")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("lang")
                .setDescription("Target language")
                .setDescriptionLocalization("ja","翻訳先の言語")
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
          //twitter
          new SlashCommandBuilder()
            .setName("twitter")
            .setDescription("Search Tweets")
            .setDescriptionLocalization("ja","ツイートを検索します")
            .addStringOption(option =>
              option
                .setName("word")
                .setDescription("Search Word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //user
          new SlashCommandBuilder()
            .setName("user")
            .setDescription("View user information")
            .setDescriptionLocalization("ja","ユーザーの情報を表示します")
            .addStringOption(option =>
              option
                .setName("id")
                .setDescription("User ID or Mention")
                .setDescriptionLocalization("ja","ユーザーID・メンション")),
          //warn
          new SlashCommandBuilder()
            .setName("warn")
            .setDescription("Warn member")
            .setDescriptionLocalization("ja","メンバーを警告します")
            .addUserOption(option =>
              option
                .setName("user")
                .setDescription("Target Member")
                .setDescriptionLocalization("ja","対象のメンバー")
                .setRequired(true))
            .addStringOption(option =>
              option
                .setName("reason")
                .setDescription("Reason")
                .setDescriptionLocalization("ja","理由")
                .setRequired(true)),
          //webshot
          new SlashCommandBuilder()
            .setName("webshot")
            .setDescription("Take a screenshot of the website")
            .setDescriptionLocalization("ja","Webサイトのスクリーンショットを撮影します")
            .addStringOption(option =>
              option
                .setName("url")
                .setDescription("Target URL")
                .setDescriptionLocalization("ja","対象のURL")
                .setRequired(true)),
          //wiki
          new SlashCommandBuilder()
            .setName("wiki")
            .setDescription("Search and view on Wikipedia")
            .setDescriptionLocalization("ja","wikipediaで検索し表示します")
            .addStringOption(option =>
              option
                .setName("word")
                .setDescription("Search word")
                .setDescriptionLocalization("ja","検索ワード")
                .setRequired(true)),
          //work
          new SlashCommandBuilder()
            .setName("work")
            .setDescription("Get paid every 20 minutes")
            .setDescriptionLocalization("ja","20分に1回お金をもらえます"),
          //ContextMenu
          //avatar
          new ContextMenuCommandBuilder()
            .setName("View Avatar")
            .setNameLocalization("ja","アバターを表示")
            .setType(ApplicationCommandType.User),
          //member
          new ContextMenuCommandBuilder()
            .setName("View Member Information")
            .setNameLocalization("ja","メンバー情報を表示")
            .setType(ApplicationCommandType.User),
          //permission
          new ContextMenuCommandBuilder()
            .setName("View Permissions")
            .setNameLocalization("ja","権限を表示")
            .setType(ApplicationCommandType.User),
          //pin
          new ContextMenuCommandBuilder()
            .setName("Pin The Message")
            .setNameLocalization("ja","メッセージをピン留め")
            .setType(ApplicationCommandType.Message),
          //quote
          new ContextMenuCommandBuilder()
            .setName("Make it a Quote")
            .setType(ApplicationCommandType.Message),
          //report
          new ContextMenuCommandBuilder()
            .setName("Report Message")
            .setNameLocalization("ja","メッセージを報告")
            .setType(ApplicationCommandType.Message),
          //to_en
          new ContextMenuCommandBuilder()
            .setName("Translate To English")
            .setNameLocalization("ja","英語に翻訳")
            .setType(ApplicationCommandType.Message),
          //to_ja
          new ContextMenuCommandBuilder()
            .setName("Translate To Japanese")
            .setNameLocalization("ja","日本語に翻訳")
            .setType(ApplicationCommandType.Message)
        ]
      }
  );

  await client.channels.cache.get(config.log).send("スラッシュコマンドをリロードしました");
}