[![Build](https://github.com/Taka005/TakasumiBOT/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/Taka005/TakasumiBOT/actions/workflows/build.yml)
[![Lint](https://github.com/Taka005/TakasumiBOT/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/Taka005/TakasumiBOT/actions/workflows/lint.yml)
[![License: GPL](https://img.shields.io/badge/License-GPL-yellow.svg)](https://opensource.org/licenses/GPL-3.0)
[![Support](https://img.shields.io/discord/987698915820335124?color=5865f2&label=Discord&logo=Discord&logoColor=ffffff)](https://discord.gg/NEesRdGQwD)
[![Email](https://img.shields.io/badge/email-takasumibot@gmail.com-blue.svg?style=flat)](mailto:takasumibot@gmail.com)
# TakasumiBOT
- とても便利な万能BOTです
- https://takasumibot.taka.ml/
- **このレポジトリはGPL-3.0ライセンスの元で公開されています**
- **これを使って出来たコードは同じライセンスで公開する必要があるためご注意下さい**
- **このプロジェクトに貢献したコードは全てTaka005に帰属します**
# 使い方
- 同じディレクトリに.envファイルを作成
- .example.envを.envに貼り付ける
- .envの中に各設定を記述する
- npm install を実行
- npm start を実行
# Configについて
- admin:管理者のユーザーID
- prefix:コマンドの先頭になる文字(一部のみに有効)
- log:ログを送るチャンネルID
- error:エラーメッセージを送るチャンネルID
# Developer
- 開発 Taka005#6668
- JavaScript(Node.js)により作成
-  サポートサーバーにも是非参加してください
- https://discord.gg/NEesRdGQwD
# 開発ルール
## コミットメッセージ
- 種類:説明 
### 種類一覧
- feat 新機能
- fix 修正
- perf パフォーマンスに関わる変更
- refactor 整理
- style コードの形の変更
- test テスト
- build ビルドシステム等の変更
- docs ドキュメントの変更
- add パッケージの追加
- delete パッケージの削除
- update パッケージの更新
## ブランチ戦略
- mainブランチには直接コミットしない
- development ブランチにコミットしチェックに合格したら自動的にマージされる

