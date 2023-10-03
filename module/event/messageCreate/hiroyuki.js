module.exports = async(message)=>{
  const { ChannelType, WebhookClient } = require("discord.js");
  const db = require("../../lib/db");
  const random = require("../../lib/random");
  const rate = require("../../lib/rate");
  const limit = require("../../lib/limit");

  const data = await db(`SELECT * FROM hiroyuki WHERE channel = ${message.channel.id} LIMIT 1;`);

  if(
    message.channel.type !== ChannelType.GuildText||
    message.author.bot||
    !data[0]
  ) return;

  if(limit(message)) return;

  const reply_1 = {
    "嘘": random(["何だろう。噓つくのやめてもらっていいですか？",`嘘は嘘であると見抜ける人でないと(${message.guild.name}を使うのは)難しい`,"本当つまんないっすよ",]),
    "写像": "「写像」？なんすか「写像」って...",
    "ごめん": random(["誰に謝ってんの？","さっきと言ってること違いません？","それって矛盾してますよね？"]),
    "すいません": random(["「すいません」？なんすか「すいません」って...", "何だろう。すみませんって言ってもらってもいいですか？","本当つまんないっすよ"]),
    "すみません": random(["誰に謝ってんの？","さっきと言ってること違いません？","それって矛盾してますよね？"]),
    "データ": "データなんかねえよ",
    "学校": "学校でしか学べない価値ってなんだろう、、と思ってみると、「役に立たないことに異議を唱えずにやり抜くこと」 なんじゃないかと思ったわけです",
    "時計": "正しい時間を知るには時計二つではダメなんすよね",
    "事故物件": "事故物件っていいですよね。 事故物件でビデオと回しててワンちゃん何か撮れたら YouTubeとかですげー再生数伸びるんで",
    "プログラミング": "目の前にわからないことがあったときに、先生に聞く能力よりも、ググって調べる能力が高くないと、プログラミングはできません"
  };

  const reply_2 = [
    `嘘は嘘であると見抜ける人でないと(${message.guild.name}を使うのは)難しい`,
    `嘘を嘘と見抜けない人は、${message.guild.name}を使うのは難しいでしょう`,
    `「${message.cleanContent}」？なんすか「${message.cleanContent}」って...`,
    "なんかそういうのって頭悪いか、嘘つきかのどちらかですよ",
    "それで勝った気になってるんですか？だったら相当頭悪いっすね",
    "それってほぼ詐欺ですよね",
    "頭の悪い人は目立つんですよ",
    "それって答えになってないですよね？",
    "それはそう言う風にしか理解できない知能の問題だと思いますけどね",
    "不快感を覚えた自分に驚いたんだよね",
    "それっておかしくないですか？",
    "僕の方が詳しいと思うんすよ",
    "「欲しいものを手に入れたい」という欲望って、埋まらないんですよ",
    "なんかそういうデータあるんですか？",
    "まず、質問に答えてもらっていいですか？",
    "何だろう。噓つくのやめてもらっていいですか？",
    "そういうのやめてもらっていいですか？",
    "さっきと言ってること違いません？",
    "それってあなたの感想ですよね？",
    "あなた相当頭悪いですよね…",
    "社会ってそんなもんじゃないんですか？",
    "ちょっと日本語わかりづらいんですけどどちらの国の方ですか？",
    "難しいことを楽しめるかどうか。僕は物事がうまくいかないことが好きなんですよ",
    "頭悪いんだからDiscord止めた方がいいっすよ",
    "Bot相手にイラついて恥ずかしくないの？w",
    "それって矛盾してますよね？",
    "根拠なしに話すのやめてもらえますか？",
    "そういう人って一定数いますよね",
    "それって意味がないと思うんです",
    "なんか言いました？",
    "そうなんですねw",
    "反論ありますか？",
    "へぇー...",
    "それってあなたの想像ですよね？"
  ];

  const reply_3 = [
    `僕は子供ができたときには「${message.guild.name}を見せない」というフィルタリングをするのではなく、「${message.guild.name}を見せても大丈夫な教育」をしたいと思っています`,
    "おいらのトゥイッターが更新されたんでいいねしてもらってもいいですか？\nhttps://twitter.com/hirox246",
    "なんだろう、まだ始まってもないのに諦めるのやめてもらっていいですか？",
    "人間って基本死ぬまでの暇つぶしなんですよ", 
    "頭悪い人はそういう思想になりますよね",
    "嘘は嘘であると見抜ける人でないと(TakasumiBOTを使うのは)難しい",
    "「好きなものは好き。だって好きだから」これ以上に、何を語る必要があるだろうか",
    "たいていのことは検索すれば答えが出てくるわけで、個人の知識として蓄える必要があるモノってなかなか無いんですよね",
    "人を応援するって、すごく幸福なことなんですよ",
    "必要なプライドなんてありません！",
    "本当つまんないっすよ",
    "え。言えないんすか？",
    "はいかいいえで答えてください。",
    "それが偉いんですか？",
    "ダメだこりゃ（笑）",
    "なんだろう。",
    "はい論破"
  ];

  const koizumi = [
    "反省はしているが(反省が)見えない自分に対しても反省している",
    `今のままではいけないと思います。だからこそ${message.guild.name}は今のままではいけないと思っている`,
    `いま${message.author.username}がおっしゃる通りとお申しあげました通りでありますし`
  ];

  const kinnikun = [
    "やー！",
    "やあ!",
    "パワー!!",
    "おい！俺の筋肉！",
    "つらいことは必ずあるが、経験することで必ず成長する。"
  ];

  const kisida = [
    "慎重に検討していく",
    "検討に検討を重ねていきたい",
    "検討を加速させたい",
    "レーシックでもすればいのか？",
    "緊張感を持って対応する",
    `${message.guild.name}についてあらゆる選択肢を排除しない`,
    "検討に検討を重ね検討を加速させていきたい"
  ];

  const webhook = new WebhookClient({id: data[0].id, token:data[0].token});

  let msg;
  if(rate(false,true,0.01)){
    msg = {
      content: random(koizumi),
      username: "小泉進次郎",
      avatarURL: "https://cdn.taka.cf/images/koizumi.png"
    };
  }else if(rate(false,true,0.01)){
    msg = {
      content: random(kinnikun),
      username: "なかやまきんに君",
      avatarURL: "https://cdn.taka.cf/images/kinnikun.png"
    };
  }else if(rate(false,true,0.007)){
    msg = {
      content: random(kisida),
      username: "岸田総理",
      avatarURL: "https://cdn.taka.cf/images/kisida.png"
    };
  }else if(rate(false,true,0.003)){
    msg = {
      content: "すいません。3色チーズ牛丼の特盛に温玉付きをお願いします",
      username: "チー牛",
      avatarURL: "https://cdn.taka.cf/images/tigyuu.png"
    };
  }else{
    let content;
    if(Object.keys(reply_1).find(key=>message.content.match(key))){
      content = reply_1[Object.keys(reply_1).find(key=>message.content.match(key))];
    }else{
      content = random(rate(reply_2,reply_3,0.1));
    }

    msg = {
      content: content,
      username: "ひろゆき",
      avatarURL: "https://cdn.taka.cf/images/hiroyuki.png"
    };
  }

  await webhook.send(msg)
    .catch(async(error)=>{
      await db(`DELETE FROM hiroyuki WHERE channel = ${message.channel.id} LIMIT 1;`);
      await message.channel.send({
        embeds:[{
          author:{
            name: "ひろゆき機能でエラーが発生しました",
            icon_url: "https://cdn.taka.cf/images/system/error.png"
          },
          color: Colors.Red,
          description: "エラーが発生したため、強制的に退出されました\n再度登録するには`/hiroyuki`を使用してください",
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
        ]
      }).catch(()=>{});
    });
}