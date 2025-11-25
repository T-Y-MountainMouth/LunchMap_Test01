# Lunch Map

Next.js + TypeScript + Tailwind CSS + AWS Amplify + Google Maps APIを使用したWebアプリケーションです。

## 機能

- Google Maps APIを使用した地図表示
- AWS Amplifyによるホスティング対応
- TypeScriptとTailwind CSSによるモダンなフロントエンド

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. Google Maps API Keyを取得:
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - Maps JavaScript APIを有効化
   - APIキーを取得

3. 環境変数を設定:
   - `.env.local`ファイルにGoogle Maps API Keyを設定
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. 開発サーバーを起動:
```bash
npm run dev
```

5. ブラウザで `http://localhost:3000` を開く

## AWS Amplifyへのデプロイ

1. Amplify CLIをインストール:
```bash
npm install -g @aws-amplify/cli
```

2. Amplifyプロジェクトを初期化:
```bash
amplify init
```

3. ホスティングを追加:
```bash
amplify add hosting
```

4. デプロイ:
```bash
amplify publish
```

## 技術スタック

- **Next.js 16** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **AWS Amplify** - バックエンドとホスティング
- **Google Maps API** - 地図表示

## プロジェクト構成

```
lunch-map/
├── app/
│   ├── page.tsx          # メインページ
│   ├── layout.tsx        # レイアウト
│   └── globals.css       # グローバルスタイル
├── components/
│   └── GoogleMap.tsx     # Google Mapコンポーネント
├── .env.local            # 環境変数（Gitに含めない）
└── package.json          # 依存関係
```

