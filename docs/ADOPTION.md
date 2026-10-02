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

## First pinned consumer

Trip_Plan / Visto Astra adopted Ocean Dark footer text, hover and keyboard focus
colors at commit `c84b9e1e21dc86b0f7cf54e9d70d43904455c096`.
The consumer pins Design_system revision `3c1f39b431286cac03710a8a9175a39a83244242`
and the vendored `dist/web/tokens.css` SHA-256 in `visto-astra/vendor/tatsu/revision.json`.
No runtime download or global layout migration. Chrome checks the computed semantic
colors and visible focus ring; screenshot review and consumer build/data tests passed.
Further surfaces and Android consumers are still pending.
