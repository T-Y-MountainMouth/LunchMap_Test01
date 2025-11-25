# Amplify環境変数の設定手順

このアプリケーションをAWS Amplifyにデプロイする際、Google Maps APIキーを環境変数として設定する必要があります。

## 手順

### 1. Amplifyコンソールにログイン

[AWS Amplify Console](https://console.aws.amazon.com/amplify/)にアクセス

### 2. アプリケーションを選択

デプロイしたいアプリケーションを選択します。

### 3. 環境変数を設定

1. 左側のメニューから **「アプリケーション設定」** > **「環境変数」** を選択
2. **「変数を管理」** をクリック
3. 以下の環境変数を追加:

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSyCYdwhjJwd71RdaLgVog_JI7fuLn-OYsko` |

4. **「保存」** をクリック

### 4. 再デプロイ

環境変数を設定後、アプリケーションを再デプロイします:

1. **「デプロイ」** タブに移動
2. 最新のコミットで **「再デプロイ」** をクリック

## 注意事項

### APIキーのセキュリティ

- `NEXT_PUBLIC_` プレフィックスが付いた環境変数はクライアント側に公開されます
- Google Cloud Consoleで以下のAPIキーの制限を設定することを推奨:
  - **アプリケーションの制限**: HTTPリファラー
    - 例: `https://yourdomain.amplifyapp.com/*`
  - **APIの制限**: Maps JavaScript API のみ

### 複数環境の管理

開発環境と本番環境で異なるAPIキーを使用する場合:

1. Amplifyで環境ごとに異なる環境変数を設定
2. Google Cloud Consoleで環境ごとにAPIキーを作成し、適切な制限を設定

## ビルドプロセス

`amplify.yml` は以下のように設定されています:

```yaml
build:
  commands:
    - echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" >> .env.production
    - npm run build
```

これにより、Amplifyの環境変数がビルド時に `.env.production` ファイルに書き込まれ、Next.jsアプリケーションで使用できるようになります。

## トラブルシューティング

### マップが表示されない場合

1. Amplifyコンソールで環境変数が正しく設定されているか確認
2. ビルドログで環境変数が読み込まれているか確認
3. ブラウザのコンソールでAPIキーのエラーメッセージを確認
4. Google Cloud ConsoleでAPIキーの制限設定を確認

### ビルドエラーが発生する場合

- Amplifyのビルドログを確認
- 環境変数名のタイプミスがないか確認
- `.env.production` が正しく生成されているか確認

## 参考リンク

- [Amplify環境変数ドキュメント](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Next.js環境変数ドキュメント](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Google Maps API制限設定](https://developers.google.com/maps/api-security-best-practices)
