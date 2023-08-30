const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, Colors } = require("discord.js");

module.exports = {
  5000:{
    type: "fun",
    name: "/5000",
    description: "5000兆円ジェネレーター",
    example: "`/5000 上の文字 下の文字`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("5000")
      .setDescription("5000兆円ジェネレーター")
      .addStringOption(option =>
        option
          .setName("top")
          .setDescription("上の文字")
          .setMaxLength(30)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("bottom")
          .setDescription("下の文字")
          .setMaxLength(30)
          .setRequired(true))
  },
  about:{
    type: "bot",
    name: "/about",
    description: "BOTについての情報や、関連リンクを表示します",
    example: "`/about`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
        "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("about")
      .setDescription("BOTについての情報や関連リンクを表示します")
  },
  account:{
    type: "bot",
    name: "/account",
    description: "登録されているアカウント情報を表示します",
    example: "`/account`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "アカウント情報の削除は[サポートサーバー](https://discord.gg/NEesRdGQwD)にて連絡してください",
    data: new SlashCommandBuilder()
      .setName("account")
      .setDescription("登録されているアカウント情報を表示します")
  },
  activity:{
    type: "info",
    name: "/activity",
    description: "同じアクティビティの人を表示します",
    example: "`/activity`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("activity")
      .setDescription("自分と同じアクティビティの人を表示します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("アクティビティの名前")
          .setAutocomplete(true))
  },
  afk:{
    type: "othor",
    name: "/afk",
    description: "AFK(留守電)を設定できます",
    example: "`/afk お出かけ中`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "自分が会話に戻ると、その間にされたメンションの数が表示されます",
    data: new SlashCommandBuilder()
      .setName("afk")
      .setDescription("AFKを設定します(留守電)")
      .addStringOption(option =>
        option
          .setName("message")
          .setDescription("伝言メッセージ"))
  },
  auth:{
    type: "manage",
    name: "/auth",
    description: "メンバー認証を設定します\n4種類の認証方式を選択できます",
    example: "`/auth 標準`",
    userPermission:[
      "ロールの管理"
    ],
    botPermission:[
      "ロールの管理",
      "メッセージの送信",
      "チャンネルの閲覧"
    ],
    note: "標準: ボタンを押して認証します\n計算: 簡単な計算を行って認証します\n画像: 画像に表示される文字列を選択して認証します\nWeb: TakasumiBOT Authを使用しWebで認証します",
    data: new SlashCommandBuilder()
      .setName("auth")
      .setDescription("メンバー認証を設定します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("認証方式")
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
          .setDescription("付与するロール")
          .setRequired(true))
  },
  avatar:{
    type: "info",
    name: "/avatar",
    description: "指定されたユーザーのアイコンを表示します",
    example: "`/avatar @TakasumiBOT`\n`/avatar 981314695543783484`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "サーバーで違うアイコンを設定してる場合は両方表示されます",
    data: new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("ユーザーのアイコンを表示します")
      .addStringOption(option =>
        option
          .setName("id")
          .setDescription("ユーザーID・メンション"))
  },
  ban:{
    type: "manage",
    name: "/ban",
    description: "メンバー・ユーザーをサーバーからBANすることができます",
    example: "`/ban @Arashi`\n`/ban 1066168542669590599`",
    userPermission:[
      "メンバーをBAN"
    ],
    botPermission:[
      "メンバーをBAN"
    ],
    note: "サーバーにいないユーザーでもIDを使用してBANすることができます",
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("ユーザーをサーバーからBANします")
      .addStringOption(option =>
        option
          .setName("id")
          .setDescription("ユーザーID・メンション")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("reason")
          .setDescription("理由"))
      .addIntegerOption(option =>
        option
          .setName("days")
          .setDescription("メッセージを削除する日数"))
  },
  button:{
    type: "tool",
    name: "/button",
    description: "URLのボタンを生成します",
    example: "`/button Name https://google.com`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("button")
      .setDescription("URLのボタンを生成します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("ボタンの名前")
          .setMaxLength(30)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("url")
          .setDescription("ボタンのURL")
          .setRequired(true))
  },
  channel:{
    type: "info",
    name: "/channel",
    description: "指定したチャンネルの情報を表示します",
    example: "`/channel #一般`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("channel")
      .setDescription("指定したチャンネルの情報を表示します")
      .addChannelOption(option =>
        option
          .setName("name")
          .setDescription("チャンネル名")
          .setRequired(true))
  },
  cipher:{
    type: "tool",
    name: "/cipher",
    description: "文字列を暗号・復号します",
    example: "`/cipher 暗号化 moji key`\n`/cipher 復号化 d1faf7e95c key`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "aes-128-cbcを使用して暗号化しています",
    data: new SlashCommandBuilder()
      .setName("cipher")
      .setDescription("暗号を生成・復号します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("処理方式")
          .setRequired(true)
          .addChoices(
            { name: "暗号化", value: "cipher" },
            { name: "復号化", value: "decipher" }
          ))
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("処理するテキスト")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("key")
          .setDescription("鍵")
          .setRequired(true))
  },
  cmd:{
    type: "bot",
    name: "/cmd",
    description: "関係者以外実行できません",
    example: "なし",
    userPermission:[
      "関係者"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("cmd")
      .setDescription("コマンドを実行します")
      .addStringOption(option =>
        option
          .setName("code")
          .setDescription("コード")
          .setRequired(true))
  },
  colorrole:{
    type: "manage",
    name: "/colorrole",
    description: "色付きロールを簡単に作成できます",
    example: "`/colorrole 白`",
    userPermission:[
      "ロールの管理"
    ],
    botPermission:[
      "ロールの管理"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("colorrole")
      .setDescription("色付きロールを作成します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("ロールの名前")
          .setMaxLength(30)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("color")
          .setDescription("ロールの色")
          .setRequired(true)
          .addChoices(
            { name: "白色", value: `${Colors.White}` },
            { name: "緑色", value: `${Colors.Green}` },
            { name: "青色", value: `${Colors.Blue}` },
            { name: "黄色", value: `${Colors.Yellow}` },
            { name: "紫色", value: `${Colors.Purple}` },
            { name: "金色", value: `${Colors.Gold}` },
            { name: "橙色", value: `${Colors.Orange}` },
            { name: "赤色", value: `${Colors.Red}` },
            { name: "黒色", value: `${Colors.NotQuiteBlack}` },
            { name: "Discord", value: "0x5865F2" }
          ))
  },
  db:{
    type: "bot",
    name: "/db",
    description: "関係者以外実行できません",
    example: "なし",
    userPermission:[
      "関係者"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("db")
      .setDescription("データベースにクエリを送信します")
      .addStringOption(option =>
        option
          .setName("query")
          .setDescription("クエリ")
          .setRequired(true))
  },
  debug:{
    type: "bot",
    name: "/debug",
    description: "関係者以外実行できません",
    example: "なし",
    userPermission:[
      "関係者"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "メッセージの送信",
      "メッセージの管理"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
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
          .setDescription("チャンネル"))
      .addStringOption(option =>
        option
          .setName("json")
          .setDescription("JSON"))
  },
  del:{
    type: "manage",
    name: "/del",
    description: "指定された数だけメッセージを一括で削除します",
    example: "`/del 30`\n`/del 30 @Arashi`",
    userPermission:[
      "メッセージの管理"
    ],
    botPermission:[
      "メッセージの管理"
    ],
    note: "2週間前かつ100個までメッセージを削除できます",
    data: new SlashCommandBuilder()
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
          .setDescription("削除するユーザー"))
  },
  double:{
    type: "info",
    name: "/double",
    description: "指定したユーザーのサブアカウントを検出します",
    example: "`/double @User`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "TakasumiBOT Accountに登録されている必要があります\nWeb認証を使用することで確実に検出可能です",
    data: new SlashCommandBuilder()
      .setName("double")
      .setDescription("指定したユーザーのサブアカウントを検出します")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("対象のユーザー")
          .setRequired(true))
  },
  embed:{
    type: "manage",
    name: "/embed",
    description: "埋め込みを簡単に作成し表示できます",
    example: "`/embed`",
    userPermission:[
      "メッセージの管理"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("embed")
      .setDescription("埋め込みメッセージを作成します")
  },
  emoji:{
    type: "info",
    name: "/emoji",
    description: "指定した絵文字の情報を表示します",
    example: "`/emoji 🤔`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "サーバー上のカスタム絵文字を指定する必要があります",
    data: new SlashCommandBuilder()
      .setName("emoji")
      .setDescription("絵文字の情報を表示します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("絵文字名")
          .setRequired(true))
  },
  enquete:{
    type: "tool",
    name: "/enquete",
    description: "アンケートを作成することができます",
    example: "`/enquete title`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "メッセージ履歴の閲覧"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("enquete")
      .setDescription("アンケートを作成します")
      .addStringOption(option =>
        option
          .setName("title")
          .setDescription("タイトル")
          .setMaxLength(30)
          .setRequired(true))
  },
  export:{
    type: "manage",
    name: "/export",
    description: "サーバーのデータをJSON形式に出力します",
    example: "`/export`",
    userPermission:[
      "管理者"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "様々なサーバーのデータが含まれるため扱いには注意してください",
    data: new SlashCommandBuilder()
      .setName("export")
      .setDescription("サーバーの情報をJSON形式に出力します")
  },
  filter:{
    type: "info",
    name: "/filter",
    description: "指定された日数以内に参加、アカウント作成したメンバーを表示します",
    example: "`/del 参加 3`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "1日以上90日以下のメンバーを取得できます",
    data: new SlashCommandBuilder()
      .setName("filter")
      .setDescription("指定された日数以内に参加、アカウント作成したメンバーを表示します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("種類")
          .setRequired(true)
          .addChoices(
            { name: "参加", value: "true" },
            { name: "アカウントを作成", value: "false" }
          ))
      .addIntegerOption(option =>
        option
          .setName("day")
          .setDescription("日数")
          .setRequired(true))
  },
  follow:{
    type: "bot",
    name: "/follow",
    description: "BOTのアナウンスチャンネルを追加します",
    example: "`/follow`",
    userPermission:[
      "チャンネルの管理"
    ],
    botPermission:[
      "チャンネルの管理"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("follow")
      .setDescription("BOTのアナウンスチャンネルを追加します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("設定する種類")
          .setRequired(true)
          .addChoices(
            { name: "アナウンス", value: "announce" },
            { name: "変更ログ", value: "update" }
          ))
  },
  gif:{
    type: "search",
    name: "/gif",
    description: "GIF画像を検索して表示します",
    example: "`/gif Happy`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("gif")
      .setDescription("GIF画像を検索し表示します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("検索ワード")
          .setMaxLength(30)
          .setRequired(true))
  },
  globalchat:{
    type: "othor",
    name: "/globalchat",
    description: "色々なサーバーと繋がるグローバルチャットを有効化、無効化します",
    example: "`/globalchat`",
    userPermission:[
      "チャンネルの管理"
    ],
    botPermission:[
      "リアクションの追加",
      "チャンネルの閲覧",
      "チャンネルの管理",
      "メッセージの送信",
      "ウェブフックの管理"
    ],
    note: "会話するにはTakasumiBOT Authを使用し[利用規約](https://takasumibot.github.io/terms.html)に同意する必要があります",
    data: new SlashCommandBuilder()
      .setName("globalchat")
      .setDescription("グローバルチャットを利用します")
  },
  guess:{
    type: "money",
    name: "/guess",
    description: "所持金を使用して数字当てゲームをします",
    example: "`/guess 100 3`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "勝つと賭け金が3倍\n負けると賭け金から-1.5倍",
    data: new SlashCommandBuilder()
      .setName("guess")
      .setDescription("所持金を使って数字当てゲームをします")  
      .addIntegerOption(option =>
        option
          .setName("money")
          .setDescription("賭ける金額")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("number")
          .setDescription("選ぶ数")
          .setRequired(true)
          .addChoices(
            { name: "1", value: "1" },
            { name: "2", value: "2" },
            { name: "3", value: "3" }
          ))
  },
  guideline:{
    type: "manage",
    name: "/guideline",
    description: "サーバーのガイドラインを作成し、同意するとロールが付与されます",
    example: "`/guideline @Role`",
    userPermission:[
      "ロールの管理"
    ],
    botPermission:[
      "ロールの管理",
      "チャンネルの閲覧",
      "メッセージの送信"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("guideline")
      .setDescription("サーバーのガイドラインを作成します")
      .addRoleOption(option =>
        option
          .setName("role")
          .setDescription("付与するロール")
          .setRequired(true))
  },
  hash:{
    type: "tool",
    name: "/hash",
    description: "指定した方式でテキストをハッシュ化します",
    example: "`/hash テキスト SHA256`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("hash")
      .setDescription("ハッシュを生成します")
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("ハッシュ化するテキスト")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("ハッシュ方式")
          .setRequired(true)
          .addChoices(
            { name: "SHA224", value: "sha224" },
            { name: "SHA256", value: "sha256" },
            { name: "SHA384", value: "sha384" },
            { name: "SHA512", value: "sha512" }
          ))
  },
  help:{
    type: "othor",
    name: "/help",
    description: "使い方を表示します",
    example: "`/help`\n`/help auth`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "ページを更新するときに一部の権限が必要になります",
    data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("使い方を表示します")
      .addStringOption(option =>
        option
          .setName("command")
          .setDescription("表示するコマンド名")
          .setAutocomplete(true))
  },
  hiroyuki:{
    type: "fun",
    name: "/hiroyuki",
    description: "ひろゆきを召喚、退出します",
    example: "`/hiroyuki`",
    userPermission:[
      "チャンネルの管理"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "チャンネルの管理",
      "メッセージの送信",
      "ウェブフックの管理"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("hiroyuki")
      .setDescription("ひろゆきを参加・退出させます"),
  },
  invite:{
    type: "manage",
    name: "/invite",
    description: "カスタマイズされた招待リンクを作成します",
    example: "`/invite 100 1`\n`/invite 500`",
    userPermission:[
      "招待リンクの作成"
    ],
    botPermission:[
      "招待リンクの作成"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("招待リンクを作成します")
      .addIntegerOption(option =>
        option
          .setName("time")
          .setDescription("有効期限(0で無限)")
          .setRequired(true))  
      .addIntegerOption(option =>
        option
          .setName("use")
          .setDescription("使用回数(0で無限)")
          .setRequired(true))
  },
  inviter:{
    type: "info",
    name: "/inviter",
    description: "招待ランキングを表示します",
    example: "`/inviter`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("inviter")
      .setDescription("招待ランキングを表示します"),
  },
  invites:{
    type: "info",
    name: "/invites",
    description: "サーバー又はユーザーの招待一覧を表示します",
    example: "`/invites`\n`/invites @TakasumiBOT`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("invites")
      .setDescription("サーバーやユーザーの招待一覧を表示します")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("表示するユーザー"))
  },
  kick:{
    type: "manage",
    name: "/kick",
    description: "指定されたメンバーをサーバーからKICKします",
    example: "`/kick @Arashi`",
    userPermission:[
      "メンバーをKICK"
    ],
    botPermission:[
      "メンバーをKICK"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription("メンバーをサーバーからキックします")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("キックするメンバー")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("reason")
          .setDescription("理由"))
  },
  leaderboard:{
    type: "money",
    name: "/leaderboard",
    description: "お金持ちランキングを表示します",
    example: "`/leaderboard`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("leaderboard")
      .setDescription("お金持ちランキングを表示します"),
  },
  list:{
    type: "server",
    name: "/list",
    description: "サーバー掲示板の簡易版を表示します",
    example: "`/list`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "Webサイトで全てのサーバーを閲覧できます",
    data: new SlashCommandBuilder()
      .setName("list")
      .setDescription("サーバー掲示板の簡易版を表示します"),
  },
  log:{
    type: "othor",
    name: "/log",
    description: "チャットの履歴を出力します",
    example: "`/log JSON 10`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "json、text形式が使用できます",
    data: new SlashCommandBuilder()
      .setName("log")
      .setDescription("チャットの履歴を出力します")
      .addStringOption(option =>
        option
          .setName("format")
          .setDescription("出力する形式")
          .setRequired(true)
          .addChoices(
            { name: "JSON", value: "json" },
            { name: "TEXT", value: "txt" }
          ))
      .addIntegerOption(option =>
        option
          .setName("limit")
          .setDescription("取得数")
          .setRequired(true))
  },
  lottery:{
    type: "fun",
    name: "/lottery",
    description: "指定したロールを持っているメンバーから指定した人数を選びます",
    example: "`/lottery 10 @Role`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("lottery")
      .setDescription("指定したロールを持っているメンバーから指定した人数を選びます")
      .addIntegerOption(option =>
        option
          .setName("number")
          .setDescription("選ぶ人数")
          .setRequired(true))
      .addRoleOption(option =>
        option
          .setName("role")
          .setDescription("対象のロール")
          .setRequired(true))
  },
  math:{
    type: "tool",
    name: "/math",
    description: "式を計算します",
    example: "`/math 4 * 25`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("math")
      .setDescription("式を計算します")  
      .addStringOption(option =>
        option
          .setName("code")
          .setDescription("計算式")
          .setRequired(true))
  },
  mc:{
    type: "tool",
    name: "/mc",
    description: "指定したアドレスのMinecraftサーバーの情報を表示します",
    example: "`/mc Java版 2b2t.jp`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("mc")
      .setDescription("マインクラフトサーバーの情報を表示します")
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
          .setDescription("サーバーアドレス")
          .setRequired(true))
  },
  miq:{
    type: "fun",
    name: "/miq",
    description: "Make it a Quoteを生成します",
    example: "`/miq これはテストです`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("miq")
      .setDescription("Make it a Quoteを生成します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("生成する種類")
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
          .setDescription("表示するテキスト")
          .setRequired(true))
  },
  moderate:{
    type: "manage",
    name: "/moderate",
    description: "AutoModを使用したモデレート機能を設定します",
    example: "`/moderate spam`",
    userPermission:[
      "サーバーの管理"
    ],
    botPermission:[
      "サーバーの管理"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("moderate")
      .setDescription("AutoModを使用したモデレート機能を設定します")  
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("設定する機能")
          .setRequired(true)
          .addChoices(
            { name: "スパム", value: "spam" },
            { name: "メンションスパム", value: "mention" },
            { name: "招待リンク", value: "invite" },
            { name: "リンク", value: "link" },
            { name: "大文字スパム", value: "capital"},
            { name: "トークン", value: "token" },
            { name: "リセット", value: "reset" }
          ))
  },
  money:{
    type: "money",
    name: "/money",
    description: "ユーザーの所持金を確認します",
    example: "`/money @User`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("money")
      .setDescription("ユーザーの所持金を確認します")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("対象のユーザー"))
  },
  nslookup:{
    type: "tool",
    name: "/nslookup",
    description: "DNS情報を取得します",
    example: "`/nslookup google.com`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("nslookup")
      .setDescription("DNS情報を取得します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("取得するアドレス")
          .setRequired(true))
  },
  omikuji:{
    type: "fun",
    name: "/omikuji",
    description: "おみくじを引きます",
    example: "`/omikuji`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("omikuji")
      .setDescription("おみくじを引きます")
  },
  package:{
    type: "search",
    name: "/pachage",
    description: "パッケージを検索して表示します",
    example: "`/package NPM discord.js`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("package")
      .setDescription("パッケージを検索します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("検索するパッケージマネージャー")
          .setRequired(true)
          .addChoices(
            { name: "NPM", value: "npm" },
            { name: "PYPI", value: "pypi" }
          ))
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("検索ワード")
          .setMaxLength(30)
          .setRequired(true))
  },
  panel:{
    type: "manage",
    name: "/panel",
    description: "役職パネルを作成します",
    example: "`/panel title @Role1 @Role2`",
    userPermission:[
      "ロールの管理"
    ],
    botPermission:[
      "ロールの管理",
      "チャンネルの閲覧",
      "メッセージの送信"
    ],
    note: "同じロールは選択できません\n最大8個までロールを選択できます\nロールの付与にはレート制限があります",
    data: new SlashCommandBuilder()
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
      .addStringOption(option =>
        option
          .setName("title")
          .setDescription("タイトル"))
  },
  pay:{
    type: "money",
    name: "/pay",
    description: "所持金を使用して機能を購入します",
    example: "`/pay 種類 10`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "グローバルチャットの色変更(黄色): 一回10円\nグローバルチャットの色変更(赤色): 一回100円",
    data: new SlashCommandBuilder()
      .setName("pay")
      .setDescription("所持金を使用して機能を購入します")  
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("買う機能")
          .setRequired(true)
          .addChoices(
            { name: "一回10円: グローバルチャットの表示色(黄色)", value: "yellow" },
            { name: "一回100円: グローバルチャットの表示色(赤色)", value: "red" },
            { name: "一回800円: グローバルチャット表示色(青色)", value: "blue" }
          ))
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("買う回数")
          .setRequired(true))
  },
  permission:{
    type: "info",
    name: "/permission",
    description: "指定されたユーザーの権限を表示します",
    example: "`/permission @TakasumiBOT`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("permission")
      .setDescription("ユーザーの権限を表示します")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("表示するユーザー"))
  },
  poll:{
    type: "tool",
    name: "/poll",
    description: "投票を作成することができます",
    example: "`/poll Title One two Three`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "リアクションの追加"
    ],
    note: "選択肢は最大8個まで設定できます",
    data: new SlashCommandBuilder()
      .setName("poll")
      .setDescription("投票を作成します")
      .addStringOption(option =>
        option
          .setName("title")
          .setDescription("タイトル")
          .setMaxLength(30)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("select_1")
          .setDescription("選択1")
          .setMaxLength(50)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("select_2")
          .setDescription("選択2")
          .setMaxLength(50)
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("select_3")
          .setDescription("選択3")
          .setMaxLength(50))
      .addStringOption(option =>
        option
          .setName("select_4")
          .setDescription("選択4")
          .setMaxLength(50) )
      .addStringOption(option =>
        option
          .setName("select_5")
          .setDescription("選択5")
          .setMaxLength(50))
      .addStringOption(option =>
        option
          .setName("select_6")
          .setDescription("選択6")
          .setMaxLength(50))
      .addStringOption(option =>
        option
          .setName("select_7")
          .setDescription("選択7")
          .setMaxLength(50))
      .addStringOption(option =>
        option
          .setName("select_8")
          .setDescription("選択8")
          .setMaxLength(50))
  },
  qr:{
    type: "tool",
    name: "/qr",
    description: "QRコードを生成・読み取ります",
    example: "`/qr 生成 text`\n`/qr 読み込む https://example.com/qr.png`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "読み込むURLは有効なものである必要があります",
    data: new SlashCommandBuilder()
      .setName("qr")
      .setDescription("QRコードを読み取り・生成します")
      .addStringOption(option =>
        option
          .setName("type")
          .setDescription("実行する操作")
          .setRequired(true)
          .addChoices(
            { name: "生成", value: "gen" },
            { name: "読み取り", value: "read" }
          ))
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("テキスト・URL")
          .setRequired(true))
  },
  random:{
    type: "fun",
    name: "/random",
    description: "ランダムで選びます",
    example: "`/random A B C`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("random")
      .setDescription("ランダムで選びます")
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
          .setDescription("選択8"))
      .addStringOption(option =>
        option
          .setName("select_9")
          .setDescription("選択9"))
      .addStringOption(option =>
        option
          .setName("select_10")
          .setDescription("選択10"))
  },
  register:{
    type: "server",
    name: "/register",
    description: "サーバー掲示板に登録、削除を行います",
    example: "`/register`",
    userPermission:[
      "管理者"
    ],
    botPermission:[
      "招待リンクの作成"
    ],
    note: "TakasumiBOT Authによる認証が必要です",
    data: new SlashCommandBuilder()
      .setName("register")
      .setDescription("サーバー掲示板に登録、削除を行います"),
  },
  reload:{
    type: "bot",
    name: "/reload",
    description: "関係者以外実行できません",
    example: "なし",
    userPermission:[
      "関係者"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription("BOTのリロードをします"),
  },
  reset:{
    type: "manage",
    name: "/reset",
    description: "実行したチャンネルを**完全**にリセットします",
    example: "`/reset`",
    userPermission:[
      "管理者"
    ],
    botPermission:[
      "チャンネルの管理",
      "チャンネルの閲覧",
      "メッセージの送信"
    ],
    note: "実行して確認ボタンを押すことでリセットできます",
    data: new SlashCommandBuilder()
      .setName("reset")
      .setDescription("実行したチャンネルを完全にリセットします")
  },
  retranslate:{
    type: "fun",
    name: "/retranslate",
    description: "様々な言語で翻訳を25回繰り返します",
    example: "`/retranslate こんにちは`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("retranslate")
      .setDescription("様々な言語で翻訳を25回繰り返します")
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("再翻訳するテキスト")
          .setRequired(true))
  },
  role:{
    type: "info",
    name: "/role",
    description: "指定した役職の情報を表示します",
    example: "`/role @Role`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
        "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("role")
      .setDescription("役職の内容を表示します")
      .addRoleOption(option =>
        option
          .setName("name")
          .setDescription("表示するロール")
          .setRequired(true))
  },
  rolecount:{
    type: "info",
    name: "/rolecount",
    description: "それぞれのロールを持っている人数と割合を表示します",
    example: "`/rolecount`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("rolecount")
      .setDescription("それぞれのロールを持っている人数と割合を表示します")
  },
  safeweb:{
    type: "tool",
    name: "/safeweb",
    description: "Webサイトの安全性を評価します",
    example: "`/safeweb https://google.com/`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "指定するURLは有効なものである必要があります",
    data: new SlashCommandBuilder()
      .setName("safeweb")
      .setDescription("Webサイトの安全性を評価します")
      .addStringOption(option =>
        option
          .setName("url")
          .setDescription("対象のURL")
          .setRequired(true))
  },
  script:{
    type: "tool",
    name: "/script",
    description: "プログラムを実行します",
    example: "`/script JavaScript`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
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
          ))
  },
  server:{
    type: "info",
    name: "/server",
    description: "サーバーの情報を表示します",
    example: "`/server`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("server")
      .setDescription("サーバーの情報を表示します")
  },
  setting:{
    type: "manage",
    name: "/setting",
    description: "サーバーの各種設定を変更します",
    example: "`/setting bump @Role`\n`/setting help`",
    userPermission:[
      "管理者"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "メッセージの送信",
      "ウェブフックの管理"
    ],
    note: "詳細は`/setting help`を実行してください",
    data: new SlashCommandBuilder()
      .setName("setting")
      .setDescription("サーバーの設定を変更します")
      .addSubcommand(subcommand =>
        subcommand
          .setName("help")
          .setDescription("設定のヘルプを表示します"))
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
          .setName("up")
          .setDescription("TakasumiBOTのUP時に通知するロールを設定します")
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
          .setDescription("Bump通知・Dissoku通知・メッセージ展開の有効・無効を切り替えます"))
      .addSubcommand(subcommand =>
        subcommand
          .setName("info")
          .setDescription("データベースの設定状況を表示します"))
      .addSubcommand(subcommand =>
        subcommand
          .setName("delete")
          .setDescription("データベースに登録されてるサーバーの情報を全て削除します"))
  },
  short:{
    type: "tool",
    name: "/short",
    description: "短縮URLを作成します",
    example: "`/short https://google.com/`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "指定するURLは有効なものである必要があります",
    data: new SlashCommandBuilder()
      .setName("short")
      .setDescription("短縮URLを作成します")
      .addStringOption(option =>
        option
          .setName("url")
          .setDescription("短縮するURL")
          .setRequired(true))
  },
  skin:{
    type: "tool",
    name: "/skin",
    description: "マインクラフトのスキンを検索します",
    example: "`/skin User`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "Java版専用です",
    data: new SlashCommandBuilder()
      .setName("skin")
      .setDescription("マインクラフトのスキンを検索します")
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("ユーザー名")
          .setRequired(true))
  },
  slowmode:{
    type: "manage",
    name: "/slowmode",
    description: "チャンネルに低速モードを設定します",
    example: "`/slowmode 100`",
    userPermission:[
      "チャンネルの管理"
    ],
    botPermission:[
      "チャンネルの管理"
    ],
    note: "秒単位で低速を設定することができます",
    data: new SlashCommandBuilder()
      .setName("slowmode")
      .setDescription("チャンネルに低速モードを設定します")
      .addIntegerOption(option =>
        option
          .setName("time")
          .setDescription("設定する秒数")
          .setRequired(true))
  },
  snowflake:{
    type: "othor",
    name: "/snowflake",
    description: "Snowflakeを解析します",
    example: "`/snowflake 987698915820335124`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "有効な[Snowflake](https://discord.com/developers/docs/reference#snowflakes)である必要があります",
    data: new SlashCommandBuilder()
      .setName("snowflake")
      .setDescription("Snowflakeを解析します")
      .addStringOption(option =>
        option
          .setName("id")
          .setDescription("解析するID")
          .setRequired(true))
  },
  status:{
    type: "bot",
    name: "/status",
    description: "BOTの情報やサーバーの状態を表示します",
    example: "`/status`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("status")
      .setDescription("BOTのステータスを表示します")
  },
  system:{
    type: "bot",
    name: "/system",
    description: "関係者以外実行できません",
    example: "なし",
    userPermission:[
      "関係者"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("system")
      .setDescription("BOTの管理をします")
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
          .setDescription("メッセージ/理由/金額"))
  },
  ticket:{
    type: "manage",
    name: "/ticket",
    description: "簡易的なチケット機能を作成します",
    example: "`/ticket`",
    userPermission:[
      "チャンネルの管理",
      "メッセージの管理"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "チャンネルの管理",
      "メッセージの送信"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("ticket")
      .setDescription("お問い合わせ機能を作成します")
  },
  timeout:{
    type: "manage",
    name: "/timeout",
    description: "指定したメンバーをタイムアウトします",
    example: "`/timeout @Arashi 1000 荒らし`\n`/timeout @Arashi`",
    userPermission:[
      "メンバーをモデレート"
    ],
    botPermission:[
      "メンバーのモデレート"
    ],
    note: "秒単位でタイムアウトすることができます\n秒が指定されない場合デフォルト(30秒)になります",
    data: new SlashCommandBuilder()
      .setName("timeout")
      .setDescription("メンバーをタイムアウトします")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("ユーザーID・メンション")
          .setRequired(true))
      .addIntegerOption(option =>
        option
          .setName("time")
          .setDescription("時間(秒)"))
      .addStringOption(option =>
        option
          .setName("reason")
          .setDescription("理由"))
  },
  top:{
    type: "othor",
    name: "/top",
    description: "実行したチャンネルの1番最初のメッセージリンクを表示します",
    example: "`/top`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "メッセージ履歴の閲覧"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("top")
      .setDescription("チャンネルの最初のメッセージのリンクを表示します"),
  },
  translate:{
    type: "tool",
    name: "/translate",
    description: "テキストを翻訳します",
    example: "`/translate hello 日本語`\n`/translate こんにちは 英語`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "Google翻訳を使用して翻訳されています",
    data: new SlashCommandBuilder()
      .setName("translate")
      .setDescription("テキストを翻訳します")
      .addStringOption(option =>
        option
          .setName("text")
          .setDescription("翻訳するテキスト")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("lang")
          .setDescription("翻訳先の言語")
          .setRequired(true)
          .addChoices(
            { name: "日本語", value: "ja" },
            { name: "英語", value: "en" },
            { name: "韓国語", value: "ko" },
            { name: "中国語", value: "zh" },
            { name: "ロシア語", value: "ru" },
            { name: "フランス語", value: "fr" },
            { name: "ドイツ語", value: "de" }
          ))
  },
  twitter:{
    type: "search",
    name: "/twitter",
    description: "ツイートを検索します",
    example: "`/twitter Discord`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "検索ワードに`id:ユーザー名`を指定することで特定のユーザーのツイートを取得できます",
    data: new SlashCommandBuilder()
      .setName("twitter")
      .setDescription("ツイートを検索します")
      .addStringOption(option =>
        option
          .setName("word")
          .setDescription("検索ワード")
          .setMaxLength(30)
          .setRequired(true))
  },
  up:{
    type: "server",
    name: "/up",
    description: "サーバー掲示板の表示順位を上げます",
    example: "`/up`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "招待リンクの作成"
    ],
    note: "BOTの権限が不十分だと自動的に登録が解除される場合があります",
    data: new SlashCommandBuilder()
      .setName("up")
      .setDescription("サーバー掲示板の表示順位を上げます"),
  },
  user:{
    type: "info",
    name: "/user",
    description: "指定されたユーザーを検索して表示します",
    example: "`/user @TakasumiBOT`\n`/user 981314695543783484`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "メンバー情報も取得できる場合は詳細情報まで表示します",
    data: new SlashCommandBuilder()
      .setName("user")
      .setDescription("ユーザーの情報を表示します")
      .addStringOption(option =>
        option
          .setName("id")
          .setDescription("ユーザーID・メンション"))
  },
  warn:{
    type: "manage",
    name: "/warn",
    description: "指定されたユーザーを警告します",
    example: "`/warn @Arashi`",
    userPermission:[
      "サーバーの管理"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "メンバーがDMを拒否している場合警告できません",
    data: new SlashCommandBuilder()
      .setName("warn")
      .setDescription("メンバーを警告します")
      .addUserOption(option =>
        option
          .setName("user")
          .setDescription("対象のメンバー")
          .setRequired(true))
      .addStringOption(option =>
        option
          .setName("reason")
          .setDescription("理由")
          .setMaxLength(300)
          .setRequired(true))
  },
  webshot:{
    type: "tool",
    name: "/webshot",
    description: "Webサイトのスクリーンショットを撮影します",
    example: "`/webshot https://google.com/`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "指定するURLは有効なものである必要があります\n一部のサイトはスクリーンショットが撮影できない場合があります",
    data: new SlashCommandBuilder()
      .setName("webshot")
      .setDescription("Webサイトのスクリーンショットを撮影します")
      .addStringOption(option =>
        option
          .setName("url")
          .setDescription("対象のURL")
          .setRequired(true))
  },
  wiki:{
    type: "search",
    name: "/wiki",
    description: "Wikipediaの検索をします",
    example: "`/wiki Discord`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし" ,
    data: new SlashCommandBuilder()
      .setName("wiki")
      .setDescription("wikipediaで検索し表示します")
      .addStringOption(option =>
        option
          .setName("word")
          .setDescription("検索ワード")
          .setMaxLength(30)
          .setRequired(true))
  },
  work:{
    type: "money",
    name: "/work",
    description: "20分に1回お金を貰えます",
    example: "`/work`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "100円から500円のお金が貰えます",
    data: new SlashCommandBuilder()
      .setName("work")
      .setDescription("20分に1回お金をもらえます")
  },
  yahoo:{
    type: "search",
    name: "/yahoo",
    description: "Yahooで検索します",
    example: "`/yahoo discord.js`",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new SlashCommandBuilder()
      .setName("yahoo")
      .setDescription("Yahooで検索し表示します")
      .addStringOption(option =>
        option
          .setName("word")
          .setDescription("検索ワード")
          .setRequired(true))
  },
  アバターを表示:{
    type: "contextmenu",
    name: "アバターを表示",
    description: "ユーザーのアイコンを表示します",
    example: "`アバターを表示`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "サーバーで違うアイコンを設定してる場合は両方表示されます",
    data: new ContextMenuCommandBuilder()
      .setName("アバターを表示")
      .setType(ApplicationCommandType.User)
  },
  メンバー情報を表示:{
    type: "contextmenu",
    name: "メンバー情報を表示",
    description: "メンバーの情報を表示します",
    example: "`メンバー情報を表示`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "サーバーに存在しないメンバーは表示できません",
    data: new ContextMenuCommandBuilder()
      .setName("メンバー情報を表示")
      .setType(ApplicationCommandType.User)
  },
  Make_it_a_Quote:{
    type: "contextmenu",
    name: "Make it a Quote",
    description: "Make it a Quoteを生成します",
    example: "`Make it a Quote`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new ContextMenuCommandBuilder()
      .setName("Make it a Quote")
      .setType(ApplicationCommandType.Message)
  },
  権限を表示:{
    type: "contextmenu",
    name: "権限を表示",
    description: "メンバーの持っている権限を表示します",
    example: "`権限を表示`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new ContextMenuCommandBuilder()
      .setName("権限を表示")
      .setType(ApplicationCommandType.User)
  },
  メッセージをピン留め:{
    type: "contextmenu",
    name: "メッセージをピン留め",
    description: "メッセージを常に下に表示します",
    example: "`メッセージをピン留め`をクリック",
    userPermission:[
      "チャンネルの管理",
      "メッセージの管理"
    ],
    botPermission:[
      "チャンネルの閲覧",
      "チャンネルの管理",
      "メッセージの送信",
      "メッセージの管理"
    ],
    note: "最大6個まで作成できます\n連投し続けると3分間制限がかかります",
    data: new ContextMenuCommandBuilder()
      .setName("メッセージをピン留め")
      .setType(ApplicationCommandType.Message)
  },
  メッセージを報告:{
    type: "contextmenu",
    name: "メッセージを報告",
    description: "サポートサーバーにメッセージを報告します",
    example: "`メッセージを報告`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "報告されたメッセージの周囲のメッセージも送信されます",
    data: new ContextMenuCommandBuilder()
      .setName("メッセージを報告")
      .setType(ApplicationCommandType.Message)
  },
  英語に翻訳:{
    type: "contextmenu",
    name: "英語に翻訳",
    description: "メッセージを英語に翻訳します",
    example: "`英語に翻訳`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new ContextMenuCommandBuilder()
      .setName("英語に翻訳")
      .setType(ApplicationCommandType.Message)
  },
  日本語に翻訳:{
    type: "contextmenu",
    name: "日本語に翻訳",
    description: "メッセージを日本語に翻訳します",
    example: "`日本語に翻訳`をクリック",
    userPermission:[
      "必要なし"
    ],
    botPermission:[
      "必要なし"
    ],
    note: "なし",
    data: new ContextMenuCommandBuilder()
      .setName("日本語に翻訳")
      .setType(ApplicationCommandType.Message)
  }
}