# Automation

## Design System repository

PR / main push ごとに以下を実行する。

1. `design-tokens.json` から Web / Android を再生成
2. 生成差分が残っていないか確認
3. shared authored source の hard-coded color / dp / sp を検出
4. Android library を build

## Consumer repositories

各 consumer は Design System の revision を pin する。

推奨フロー:

1. 定期 workflow が Design System の最新 revision を確認
2. revision が変わっていれば shared source / dependency を更新
3. branch を作成
4. build / test
5. PR を自動作成
6. 人が UI 差分を確認
7. merge
8. 通常の consumer release pipeline で配信

自動 merge と自動本番配信は初期段階では行わない。

## Why polling

Design System から複数 repository へ直接 push するには cross-repository token 管理が必要になる。各 consumer が public Design System を定期確認する方式なら、consumer 自身の `GITHUB_TOKEN` だけで PR 作成まで完結できる。
