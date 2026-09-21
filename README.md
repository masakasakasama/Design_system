# Tatsu Design System

Android と Web の複数個人アプリで共通利用する、小さく始めて拡張できるデザインシステムです。

## 方針

- Single Source of Truth は `tokens/design-tokens.json`
- 配布は原則ビルド時
- Ocean / Sage / Amethyst と Light / Dark はアプリ内に同梱
- サーバーからの Runtime Token 配信は現時点では採用しない
- 各アプリは共通トークンまたは共通コンポーネントを利用し、独自の色・余白の直書きを避ける
- Android と Web はコードを無理に共有せず、同じ意味のトークンを各プラットフォーム向けに生成する

## Token layers

1. Primitive
   - palette, spacing, radius, typography, motion
2. Semantic
   - background, surface, textPrimary, accent, error など
3. Component
   - card, button, metric, page など
4. App alias
   - 各アプリ固有の意味が必要な場合のみ consumer 側で追加

## Generate

```bash
npm run generate
```

生成先:

- Web: `dist/web/`
- Android: `android/tatsu-design-system/.../generated/TatsuTokens.kt`

生成物はコミット対象です。CI でトークンと生成物の不一致を検出します。

## Web

```js
import { applyTatsuTheme } from "@tatsu/design-system";
import "@tatsu/design-system/styles.css";

applyTatsuTheme({ accent: "ocean", theme: "dark" });
```

HTML 側だけで切り替える場合:

```html
<html data-tatsu-accent="sage" data-tatsu-theme="light">
```

## Android Compose

```kotlin
TatsuTheme(
    accent = TatsuAccent.Ocean,
    darkTheme = true,
) {
    // app UI
}
```

共通部品として `TatsuCard`, `TatsuMetric`, `TatsuButton` を提供します。

## Update strategy

Design System の変更後は consumer app の参照 revision を更新し、再生成・再ビルドします。consumer 側では自動 PR を作り、人が画面差分を確認してから merge / release する運用を推奨します。

詳細は `docs/ARCHITECTURE.md`, `docs/ADOPTION.md`, `docs/AUTOMATION.md` を参照してください。
