# 🚀 AI Writing Assistant

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Phase](https://img.shields.io/badge/phase-1_complete-brightgreen)

**AI駆動のマークダウンライティングアシスタント**

CodeMirrorとリアルタイムプレビューを組み合わせた、現代的なマークダウンエディタです。将来的にAI機能を統合して、文章作成を支援します。

## 🎯 実装済み機能（Phase 1）

- **📝 高機能エディタ**: CodeMirror 6によるマークダウン編集
- **👁️ リアルタイムプレビュー**: 分割ペインでの即座な表示
- **💾 自動保存**: IndexedDBによる30秒間隔の自動保存
- **📋 ドキュメント管理**: 作成・削除・選択機能
- **🌙 ダークモード**: 切り替え可能なテーマ
- **🎨 レスポンシブUI**: Tailwind CSSによるモダンなデザイン
- **🔧 基本ツールバー**: 太字、斜体、見出し等の挿入機能

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── Editor.tsx          # CodeMirrorエディタ
│   ├── Preview.tsx         # マークダウンプレビュー
│   ├── Toolbar.tsx         # フォーマットツールバー
│   └── DocumentList.tsx    # ドキュメント一覧
├── types/
│   └── Document.ts         # TypeScript型定義
├── utils/
│   └── database.ts         # IndexedDBデータ管理
├── App.tsx                 # メインアプリケーション
└── main.tsx               # エントリーポイント
```

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite 5
- **エディタ**: CodeMirror 6
- **マークダウン**: markdown-it
- **スタイリング**: Tailwind CSS v4 + Typography plugin
- **データ保存**: IndexedDB (idb)
- **テーマ**: One Dark theme support

## 🚀 セットアップ

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
2. **ドキュメント編集**: 左ペインでマークダウンを記述
3. **リアルタイムプレビュー**: 右ペインで結果を確認
4. **自動保存**: 30秒間隔で自動的に保存
5. **ダークモード**: ヘッダーの🌙ボタンで切り替え

### ツールバー機能
- **太字**: `**text**`
- **斜体**: `*text*`
- **見出し**: `# ## ###`
- **リンク**: `[text](url)`
- **リスト**: `- item` または `1. item`
- **コードブロック**: ` ```code``` `
- **引用**: `> quote`

### キーボードショートカット
- **Ctrl+B**: 太字
- **Ctrl+I**: 斜体
- **Ctrl+S**: 手動保存

## 🔮 今後の計画（Phase 2〜4）

### Phase 2: AI機能統合 🤖
- **文章生成**: AIによる文章作成支援
- **要約機能**: 長文の自動要約
- **校正支援**: 文法・スタイルの改善提案
- **翻訳機能**: 多言語対応

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

### 新機能の追加
1. 適切なコンポーネントディレクトリに配置
2. TypeScript型定義を更新
3. テストの追加（推奨）
4. ドキュメントの更新

### コンポーネント設計原則
- **単一責任**: 1つのコンポーネントは1つの責任
- **型安全性**: TypeScriptによる厳密な型定義
- **再利用性**: propsによる柔軟な設計
- **パフォーマンス**: 必要に応じてmemo化

## 🐛 トラブルシューティング

### よくある問題

**Q: 開発サーバーが起動しない**
A: `node_modules`を削除して`npm install`を再実行

**Q: ダークモードが正しく表示されない**
A: ブラウザのlocalStorageをクリアしてページを再読み込み

**Q: 自動保存が機能しない**
A: ブラウザがIndexedDBをサポートしているか確認

詳細なエラー対応は `.ai/knowledge/current-local/troubleshooting.md` を参照してください。

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

---

**🎉 Happy Writing with AI! ✍️**

このプロジェクトは [VIBE Coding Template](https://github.com/kirikab-27/vibe-coding-template) を使用して開発されました。