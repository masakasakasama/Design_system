# Architecture

## Decision

Tatsu Design System は Build-time distribution を標準とする。

Runtime token distribution は、インストール済みアプリへ即時にブランド変更を届ける必要が実際に発生するまで導入しない。

## Why

Build-time 方式では以下を避けられる。

- オフライン fallback
- schema version negotiation
- token download failure
- rollback / staged rollout
- 古いアプリとの runtime compatibility
- layout-breaking remote values

10 個程度の個人アプリでは、Build-time の単純さと検証可能性を優先する。

## Theme model

Accent:
- Ocean
- Sage
- Amethyst

Mode:
- Light
- Dark

6 通りを生成して consumer に同梱する。利用者が同梱済みテーマを切り替える場合はアプリ更新不要。トークンそのものを変更した場合は次回 build / deploy で反映する。

## Token ownership

`tokens/design-tokens.json` だけが design value の原本。

consumer app は次を禁止する方向で段階移行する。

- 独自 HEX / RGB
- 共通用途の dp / sp / px
- 共通コンポーネントを複製して独自調整

アプリ固有の意味が必要な場合は primitive を直接参照せず、semantic または app alias を経由する。

## Runtime tokens later

将来必要になった場合も、runtime 化の候補は以下に限定する。

- accent color
- surface color
- branding の一部

spacing, typography, radius, component size は build-time のまま維持する。
