# 🤖 AI Writing Assistant

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Phase](https://img.shields.io/badge/phase-2_complete-brightgreen)

**AI駆動のマークダウンライティングアシスタント - 完全版**

複数のAIプロバイダーに対応した高機能なマークダウンエディタです。リアルタイムプレビュー、AI支援機能、そして直感的な3ペインレイアウトで、効率的な文章作成をサポートします。

## 🎯 実装済み機能（Phase 2 完了）

### 📝 エディタ機能
- **高機能エディタ**: CodeMirror 6によるマークダウン編集
- **リアルタイムプレビュー**: 分割ペインでの即座な表示
- **自動保存**: IndexedDBによる30秒間隔の自動保存
- **ドキュメント管理**: 作成・削除・選択機能
- **基本ツールバー**: 太字、斜体、見出し等の挿入機能

### 🤖 AI機能（NEW!）
- **AI テキスト改善**: 文章の校正・改善提案
- **AI 継続執筆**: 文章の自動続き生成
- **AI 要約機能**: 長文の自動要約
- **マルチプロバイダー対応**: Google Gemini, Cohere, HuggingFace
- **セキュアなAPI key管理**: 暗号化されたローカルストレージ
- **接続テスト機能**: リアルタイムでのAI接続確認

### 🎨 UI/UX
- **3ペインレイアウト**: AI機能・ドキュメント管理・エディタの最適配置
- **ダークモード**: 切り替え可能なテーマ
- **レスポンシブデザイン**: Tailwind CSSによるモダンなUI
- **プロフェッショナルなモーダル**: React Portal使用の高品質なダイアログ

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── Editor.tsx              # CodeMirrorエディタ
│   ├── Preview.tsx             # マークダウンプレビュー
│   ├── Toolbar.tsx             # フォーマットツールバー
│   ├── DocumentList.tsx        # ドキュメント一覧
│   ├── AISettingsModal.tsx     # AI設定モーダル
│   ├── AISidebar.tsx           # AIサイドバー
│   ├── AISuggestionsPanel.tsx  # AI提案パネル
│   └── LoadingSpinner.tsx      # ローディング表示
├── services/ai/
│   ├── AIService.ts            # AI抽象ベースクラス
│   ├── AIServiceFactory.ts     # AIサービスファクトリ
│   ├── GeminiService.ts        # Google Gemini実装
│   ├── CohereService.ts        # Cohere実装
│   └── HuggingFaceService.ts   # HuggingFace実装
├── types/
│   ├── Document.ts             # ドキュメント型定義
│   └── AI.ts                   # AI関連型定義
├── utils/
│   ├── database.ts             # IndexedDBデータ管理
│   └── aiSettings.ts           # AI設定管理
├── App.tsx                     # メインアプリケーション
└── main.tsx                   # エントリーポイント
```

## 🛠️ 技術スタック

### フロントエンド
- **React 18** + **TypeScript** - モダンなコンポーネント開発
- **Vite 5** - 高速ビルドツール
- **Tailwind CSS v4** - ユーティリティファーストCSS

### エディタ・プレビュー
- **CodeMirror 6** - 高機能エディタライブラリ
- **markdown-it** - 高速マークダウンパーサー

### AI統合
- **Google Generative AI** (@google/generative-ai) - Gemini API
- **Cohere AI** (cohere-ai) - Cohere API
- **HuggingFace** - Transformers API
- **crypto-js** - API key暗号化

### データ管理
- **IndexedDB** (idb) - ローカルデータストレージ
- **React Portal** - モーダル表示

## 🚀 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone https://github.com/kirikab-27/ai-writing-assistant.git
cd ai-writing-assistant
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションが http://localhost:5173 で起動します。

## 🎮 使い方

### 基本操作
1. **新規ドキュメント作成**: サイドバーの「+ New Document」ボタン
2. **ドキュメント編集**: 中央ペインでマークダウンを記述
3. **リアルタイムプレビュー**: 右ペインで結果を確認
4. **AI機能**: 左サイドバーからAI機能にアクセス

### AI機能の設定
1. **AI設定画面を開く**: 左サイドバーの「🚀 Configure AI」ボタン
2. **プロバイダー選択**: Google Gemini, Cohere, HuggingFaceから選択
3. **API Key入力**: 選択したプロバイダーのAPI keyを入力
4. **接続テスト**: 「🔍 Test Connection」で動作確認
5. **設定保存**: 「💾 Save Settings」で設定を保存

### AI機能の利用
- **✨ Improve Text**: 選択したテキストまたは全文の改善
- **➡️ Continue Writing**: 現在の文章の続きを生成
- **📝 Summarize**: 長いテキストの要約生成

### APIキーの取得方法
- **Google Gemini**: [Google AI Studio](https://makersuite.google.com)
- **Cohere**: [Cohere Dashboard](https://dashboard.cohere.ai)
- **HuggingFace**: [HuggingFace Settings](https://huggingface.co/settings/tokens)

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# Lint チェック
npm run lint

# プレビュー
npm run preview
```

## 🏗️ 開発ガイド

### AI機能の拡張
1. `src/services/ai/`に新しいサービスクラスを追加
2. `AIService`抽象クラスを継承
3. `AIServiceFactory`にプロバイダーを登録
4. `AI.ts`型定義を更新

### 新機能の追加
1. 適切なコンポーネントディレクトリに配置
2. TypeScript型定義を更新
3. `.ai/knowledge/`に実装記録を追加

### コンポーネント設計原則
- **単一責任**: 1つのコンポーネントは1つの責任
- **型安全性**: TypeScriptによる厳密な型定義
- **再利用性**: propsによる柔軟な設計
- **AI統合**: サービスレイヤーを通じた疎結合

## 🐛 トラブルシューティング

### よくある問題

**Q: AI機能が動作しない**
A: API keyが正しく設定されているか確認し、接続テストを実行してください

**Q: モーダルが正しく表示されない**
A: ブラウザキャッシュをクリアしてページを再読み込みしてください

**Q: TypeScriptエラーが発生する**
A: `npm run build`でエラー詳細を確認し、型定義を確認してください

詳細なエラー対応は `.ai/knowledge/current-local/troubleshooting.md` を参照してください。

## 🔐 セキュリティ

- **API Key暗号化**: crypto-jsによる暗号化ストレージ
- **ローカル保存**: APIキーはローカルのみに保存、外部送信なし
- **セキュアなHTTPS通信**: すべてのAI APIとの通信は暗号化

## 🔮 今後の計画（Phase 3〜4）

### Phase 3: 高度なドキュメント管理 📚
- **フォルダ機能**: ドキュメントの階層管理
- **タグ機能**: カテゴリ別整理
- **検索機能**: 全文検索
- **バージョン管理**: 変更履歴の追跡

### Phase 4: エクスポート・共有 🌍
- **多形式エクスポート**: PDF、HTML、Word
- **クラウド同期**: リアルタイム同期
- **共同編集**: マルチユーザー対応
- **パブリッシング**: Web公開機能

## 🤝 貢献

1. フォークする
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [CodeMirror](https://codemirror.net/) - 高機能エディタライブラリ
- [markdown-it](https://github.com/markdown-it/markdown-it) - マークダウンパーサー
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Vite](https://vitejs.dev/) - 高速ビルドツール
- [Google Generative AI](https://ai.google.dev/) - Gemini API
- [Cohere](https://cohere.ai/) - Cohere API
- [HuggingFace](https://huggingface.co/) - AI Models & API

---

**🤖 AI-Powered Writing Experience! ✍️**

このプロジェクトは [VIBE Coding Template](https://github.com/kirikab-27/vibe-coding-template) を使用して開発されました。