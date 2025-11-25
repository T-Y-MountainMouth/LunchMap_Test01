# GitHub Copilot 開発ガイドライン

## コミットメッセージ
**必ず日本語で記述してください。**

### フォーマット
```
<種類>: <変更内容の要約>

<詳細な説明（オプション）>

<Issue番号（オプション）>
```

### 種類
- `feat`: 新機能の追加
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの動作に影響しない変更（空白、フォーマット、セミコロンなど）
- `refactor`: バグ修正や機能追加を伴わないコードの変更
- `perf`: パフォーマンス改善
- `test`: テストの追加や修正
- `chore`: ビルドプロセスやツールの変更

### 例
```
feat: Google Maps APIの統合

- GoogleMapコンポーネントを追加
- 東京の中心座標でマップを表示
- APIキー未設定時のフォールバック画面を実装

Closes #123
```

```
fix: 地図が表示されない問題を修正

LoadScriptコンポーネントのAPIキー読み込みを修正
```

## コーディング規約

### TypeScript

1. **型定義を明示的に記述**
   ```typescript
   // 良い例
   const center: { lat: number; lng: number } = {
     lat: 35.6812,
     lng: 139.7671
   };
   
   // 避けるべき例
   const center = {
     lat: 35.6812,
     lng: 139.7671
   };
   ```

2. **interfaceとtypeの使い分け**
   - オブジェクトの形状定義: `interface`
   - ユニオン型や複雑な型: `type`

3. **非同期処理にはasync/awaitを使用**
   ```typescript
   // 良い例
   const fetchData = async (): Promise<Data> => {
     const response = await fetch('/api/data');
     return response.json();
   };
   ```

### React/Next.js

1. **コンポーネント定義**
   - 関数コンポーネントを使用
   - デフォルトエクスポートを使用
   
   ```typescript
   export default function ComponentName() {
     return <div>...</div>;
   }
   ```

2. **Client ComponentとServer Component**
   - クライアント側の処理が必要な場合のみ `'use client'` を使用
   - デフォルトはServer Component

3. **Props定義**
   ```typescript
   interface Props {
     title: string;
     children?: React.ReactNode;
   }
   
   export default function Component({ title, children }: Props) {
     return <div>{title}{children}</div>;
   }
   ```

### CSS/Tailwind

1. **Tailwind CSSを優先的に使用**
   - カスタムCSSは必要最小限に
   - グローバルスタイルは `app/globals.css` に記述

2. **クラス名の順序**
   - レイアウト → サイズ → 色 → その他
   
   ```tsx
   <div className="flex items-center justify-center w-full h-screen bg-gray-100 rounded-lg shadow-md">
   ```

### ファイル命名規則

- コンポーネント: PascalCase (`GoogleMap.tsx`)
- ユーティリティ関数: camelCase (`formatDate.ts`)
- 設定ファイル: kebab-case (`next.config.ts`)

## ディレクトリ構成

```
lunch-map/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ルートページ
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/            # 再利用可能なコンポーネント
│   └── GoogleMap.tsx
├── lib/                   # ユーティリティ関数
├── types/                 # TypeScript型定義
├── public/                # 静的ファイル
└── .env.local            # 環境変数（Git管理外）
```

### ディレクトリの役割

- `app/`: ページとレイアウト
- `components/`: 再利用可能なUIコンポーネント
- `lib/`: ビジネスロジックやユーティリティ関数
- `types/`: グローバルな型定義
- `public/`: 画像やフォントなどの静的アセット

## 環境変数

### 命名規則
- クライアント側で使用: `NEXT_PUBLIC_` プレフィックス
- サーバー側のみ: プレフィックスなし

### 設定方法

1. `.env.example` をコピーして `.env.local` を作成
   ```bash
   cp .env.example .env.local
   ```

2. 実際の値を設定
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **重要**: `.env.local` は絶対にコミットしない

## デバッグ方法

### 開発サーバーの起動

```bash
cd lunch-map
npm run dev
```

ブラウザで http://localhost:3000 を開く

### VS Codeデバッガー

1. F5キーまたはデバッグパネルから「Next.js: debug full stack」を選択
2. ブレークポイントを設定
3. デバッグ実行

### ブラウザDevTools

- Console: `console.log()` の出力確認
- Network: APIリクエストの確認
- React DevTools: コンポーネントの状態確認

### よくあるエラー

#### "Unknown file extension .tsx"
→ Node.jsで直接TSXファイルを実行しようとしている。`npm run dev` を使用してください。

#### Google Mapsが表示されない
1. `.env.local` にAPIキーが設定されているか確認
2. APIキーの名前が `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` か確認
3. ブラウザのコンソールでエラーを確認

## テスト

### テストの種類
- ユニットテスト: 個別の関数やコンポーネント
- 統合テスト: 複数のコンポーネントの連携
- E2Eテスト: ユーザーの操作フロー

### テストファイルの配置
```
components/
├── GoogleMap.tsx
└── GoogleMap.test.tsx
```

### テストの実行
```bash
npm test
```

## Pull Request

### PRの作成前チェックリスト
- [ ] ESLintエラーがないか確認 (`npm run lint`)
- [ ] ビルドが成功するか確認 (`npm run build`)
- [ ] 変更内容をテストした
- [ ] 必要に応じてドキュメントを更新した
- [ ] コミットメッセージが日本語で記述されている

### PRテンプレート
```markdown
## 変更内容
<!-- 何を変更したか簡潔に記述 -->

## 変更の理由
<!-- なぜこの変更が必要か -->

## 影響範囲
<!-- この変更が影響する範囲 -->

## テスト方法
<!-- どのようにテストしたか -->

## スクリーンショット
<!-- UIの変更がある場合は添付 -->

## 関連Issue
<!-- 関連するIssue番号 -->
```

## コードレビュー

### レビュアーのチェックポイント
- コードの可読性
- パフォーマンスへの影響
- セキュリティの考慮
- エラーハンドリング
- テストの網羅性

### レビューコメントの書き方
- 建設的なフィードバックを心がける
- 具体的な改善案を提示
- コードの良い点も指摘する

## リリース

### リリースフロー
1. developブランチから機能ブランチを作成
2. 開発・テスト
3. PRを作成してレビュー
4. developブランチにマージ
5. リリース前にステージング環境で確認
6. mainブランチにマージしてデプロイ

### バージョニング
セマンティックバージョニングに従う: `MAJOR.MINOR.PATCH`
- MAJOR: 互換性のない変更
- MINOR: 機能追加（互換性あり）
- PATCH: バグ修正

## 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
