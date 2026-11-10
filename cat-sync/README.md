# 貓貓腦迴路 — Supabase Realtime Broadcast 免儲存版

- `/` 原本貓咪測驗，`/cat-sync/` 新遊戲，沒有交叉導覽。
- 沿用既有 Supabase 專案，不新增資料表、不儲存房間或答案。使用 Realtime Broadcast 傳送房主狀態與玩家作答。
- Vercel 環境變數：沿用 `SUPABASE_URL`，另外設定 `SUPABASE_ANON_KEY`（Supabase Dashboard → Project Settings → API Keys → anon/publishable key）。不要放 service_role key 到前端。
- Supabase Realtime 必須啟用，且允許公開頻道（Public Channels）。本版使用公開 Broadcast 頻道，僅適合受邀小群體娛樂；房號不能視為安全的存取控制。
- 房主保持網頁開啟；關閉或重新整理會遺失房間狀態，所有人需重新建房。新加入玩家向房主要求同步。
- 沒有後端資料庫儲存，但 Supabase 仍作為訊息轉送服務。下載圖片在玩家瀏覽器端產生。
- 同一人重複整理頁面會產生新識別碼。建議每回合玩家到齊後再開始。
- 不要將原始 LINE 聊天紀錄直接公開；題庫內建於 HTML，部署後可被訪客查看，請先確認題目內容適合分享。
