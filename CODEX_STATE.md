# CODEX_STATE

Status: in_progress
Goal: Web/Androidの共通token生成を正しく検証し、consumerへ安全に導入する。

## Done
- 欠落/不正semantic colorと循環参照を検出して生成前に拒否する検証を追加。
- 回帰テスト2件をCIへ追加。既存Web/Kotlin生成物は変更なし。

## Current
- Web generate/hardcoded/generated-diffとAndroid AAR buildが正常。

## Next
- docs/ADOPTION.mdに従い、対象consumerでrevisionをpinし最小範囲から導入する。UI差分を確認してから配信する。
- check-hardcodedが存在しない入力パスを成功扱いする点を検証し、CI対象パスの誤記を検出する。

## Blockers
- consumerのUI移行は各repoの変更・build・画面検証が必要。現時点ではconsumer移行済みではない。

## Verification
- npm test: 2/2 passed
- npm run validate / npm run check:generated: passed、生成物差分なし
- JDK17 + SDK34 + Gradle8.9 :android:tatsu-design-system:assembleRelease: passed
- git diff --check: passed

Updated at: 2026-10-02T10:52:11.599919+00:00
