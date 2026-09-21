# Runtime tokens

現時点では採用しない。

導入条件の例:

- Play Store / APK 更新を待たず全アプリの accent を一斉変更する必要がある
- A/B または段階配信が必要
- remote branding がプロダクト要件になった

導入時に必須となる設計:

- schemaVersion
- bundled fallback
- local cache
- validation
- timeout / failure behavior
- rollback
- staged rollout
- old client compatibility

Runtime token はレイアウト値ではなく、色など安全な subset に限定する。
