# 貓貓腦迴路同步測試（Supabase Realtime）

## Vercel 設定

沿用現有 `SUPABASE_URL`，新增 `SUPABASE_PUBLISHABLE_KEY`，值取自同一 Supabase 專案 Settings → API Keys → Publishable key（`sb_publishable_...`），或 legacy anon key。設定於 Vercel Project → Settings → Environment Variables，選擇 Production（以及需要的 Preview），重新部署。

**請勿使用 `SUPABASE_SERVICE_ROLE_KEY` 或 secret key。** `/api/cat-config` 只回傳 Supabase URL 和 Publishable Key。Publishable Key 設計上可公開，瀏覽器使用者仍可在網路請求中看到；不要將其視為保密憑證。Supabase 權限與 Realtime 設定才是安全邊界。

## 使用

部署後開啟 `/cat-sync/`。房主建立房間，其他玩家輸入房號加入。需在 Supabase 啟用適當的 Realtime Broadcast / Presence 存取政策；實際可否連線取決於專案設定。這個版本不建立遊戲結果資料表，結果圖片在瀏覽器產生；不代表 Realtime 服務完全不處理暫時性訊息。房主離線可能中斷遊戲。建議先用兩台手機測試。

原本問卷首頁與遊戲沒有互相連結。


新版：房主開局選 10/15/20 題，題目為四選一，每題 30 秒，房主端計時到期自動揭曉，所有玩家提前完成亦可提前揭曉。題庫 80 題，單局不重複。未作答不計入配對默契率。
