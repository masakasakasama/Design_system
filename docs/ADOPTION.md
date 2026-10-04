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

## Astra About text adoption (2026-10-04; verified)

Trip_Plan / Visto Astra About panel credit paragraphs, authored by `about()` in
`visto-astra/src/main.js`, were adopted at consumer commit `e0daaa2e81e4c900a45091683349405c22c0fff1`.
The implementation retains the existing pinned revision
`3c1f39b431286cac03710a8a9175a39a83244242` and tokens.css SHA-256
`0fedb40e69e3f25821d445494ba35b14e39978a2112dfb88e27abf2d34941ea0`.
Apply `--tatsu-color-text-muted` to the About credit text only, with an About-specific
class so unrelated panels retain their existing styles. Preserve font size, spacing,
links, panel lifecycle, Earth rendering, and trip data. Update the vendored revision
manifest scope without changing the pinned token contents.

Consumer evidence in Trip_Plan `CODEX_STATE.md` at the commit above confirms:

- Mobile 412x915 and desktop 1440x1000 before/after comparisons: paragraph geometry,
  text, links, font size, line-height and padding unchanged.
- Computed About text color matches pinned text-muted (rgb(126, 135, 149)); ordinary
  `.credit` text retains its original color outside the About-specific class.
- About close/reopen passed; screenshots reviewed; JavaScript errors empty.
- Existing data tests 5/5 and production build passed. Trip data and token file bytes
  unchanged; vendored revision/SHA-256 unchanged; no runtime token request.
- GitHub Pages deployment CI for the consumer commit succeeded.

This Design_system run checked the immutable consumer commit, its limited file list
and saved verification evidence. It did not rerun the already passed consumer tests
or change generated tokens. Android and other surfaces remain unverified.
