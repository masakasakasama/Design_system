# Adoption

既存アプリは全面改修しない。

## Stage 1

- 既存の色定義を shared semantic token へ置換
- 画面構造と機能は変更しない
- Ocean Dark を既存見た目に近い初期値として使う

## Stage 2

- Card / Button / Metric など再利用率が高い箇所から共通 component へ置換
- loading / error / disabled / focus を共通化

## Stage 3

- accent selector と Light / Dark selector を追加
- app-specific alias が必要な箇所のみ追加

## Stage 4

- screenshot regression を導入
- hard-coded design value check を consumer CI に追加

移行中は旧 UI と新 UI の混在を許容する。新規コードから shared token を必須にする。
