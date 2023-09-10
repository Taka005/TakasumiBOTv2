module.exports = (permissions)=>{
  const permission = permissions.map(p=>{
    if(p === "CreateInstantInvite") return "招待を作成";
    if(p === "KickMembers") return "メンバーをキック";
    if(p === "BanMembers") return "メンバーをBAN";
    if(p === "Administrator") return "管理者";
    if(p === "ManageChannels") return "チャンネルの管理";
    if(p === "ManageGuild") return "サーバーの管理";
    if(p === "AddReactions") return "リアクションの追加";
    if(p === "ViewAuditLog") return "監査ログを表示";
    if(p === "PrioritySpeaker") return "優先スピーカー";
    if(p === "Stream") return "WEBカメラ";
    if(p === "ViewChannel") return "チャンネルを見る";
    if(p === "SendMessages") return "メッセージを送信";
    if(p === "SendTTSMessages") return "TTSメッセージを送信";
    if(p === "ManageMessages") return "メッセージの管理";
    if(p === "EmbedLinks") return "埋め込みリンク";
    if(p === "AttachFiles") return "ファイルを添付";
    if(p === "ReadMessageHistory") return "メッセージ履歴を見る";
    if(p === "MentionEveryone") return "@everyone、@here、全てのロールにメンション";
    if(p === "UseExternalEmojis") return "外部の絵文字を使用";
    if(p === "ViewGuildInsights") return "サーバーインサイトを見る";
    if(p === "Connect") return "接続";
    if(p === "Speak") return "発言";
    if(p === "MuteMembers") return "メンバーをミュート";
    if(p === "DeafenMembers") return "メンバーのスピーカーをミュート";
    if(p === "MoveMembers") return "メンバーを移動";
    if(p === "UseVAD") return "音声検出を使用";
    if(p === "ChangeNickname") return "ニックネームを変更";
    if(p === "ManageNicknames") return "ニックネームの管理";
    if(p === "ManageRoles") return "ロールの管理";
    if(p === "ManageWebhooks") return "ウェブフックの管理";
    if(p === "ManageEmojisAndStickers") return "絵文字とステッカーの管理";
    if(p === "ManageGuildExpressions") return "サウンドボードの管理";
    if(p === "UseApplicationCommands") return "アプリケーションコマンドの使用";
    if(p === "RequestToSpeak") return "スピーカー参加をリクエスト";
    if(p === "ManageEvents") return "イベントの管理";
    if(p === "ManageThreads") return "スレッドの管理";
    if(p === "CreatePublicThreads") return "公開スレッドの作成";
    if(p === "CreatePrivateThreads") return "プライベートスレッドの作成";
    if(p === "UseSoundboard") return "サウンドボードの使用";
    if(p === "UseExternalSounds") return "外部のサウンドボードの使用";
    if(p === "ViewCreatorMonetizationAnalytics") return "ロールサブスクリプションの分析情報を見る";
    if(p === "UseExternalStickers") return "外部のステッカーの使用";
    if(p === "SendMessagesInThreads") return "スレッドでメッセージを送信";
    if(p === "SendVoiceMessages") return "ボイスメッセージを送信";
    if(p === "UseEmbeddedActivities") return "アクティビティを使用";
    if(p === "ModerateMembers") return "メンバーをタイムアウト";
  });

  if(permission.length > 0){
    return permission;
  }else{
    return ["なし"];
  }
}