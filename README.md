# 墨昕戀愛合作型人格測驗｜Vercel + Supabase

這版可以直接部署到 Vercel，資料存到 Supabase。

## 1. Supabase 建資料表
到 Supabase → SQL Editor，執行：

`supabase/schema.sql`

## 2. 取得 Supabase 金鑰
Supabase 專案設定中取得：

- Project URL → `SUPABASE_URL`
- Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ Service Role Key 只能放 Vercel Environment Variables，絕對不要寫進前端 JS。

## 3. Vercel 環境變數
在 Vercel Project → Settings → Environment Variables 新增：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_KEY`

`ADMIN_KEY` 是妳進後台時輸入的密碼，請自己設定一組強密碼。

## 4. 部署
把整個資料夾推到 GitHub，再 Import 到 Vercel。
或安裝 Vercel CLI 後直接從專案資料夾部署。

## 網址
- `/`：填寫測驗
- `/admin`：墨昕秘密後台

## 安全設計
- 前台沒有 Supabase Service Role Key。
- 前台送出結果 → `/api/submit` → Serverless API → Supabase。
- 後台讀資料 → `/api/admin`，需要 `ADMIN_KEY`。
- Supabase 表有啟用 RLS，且沒有開 anon policy，因此匿名前端不能直接讀取表格。

## 新增：多人連線小遊戲

- 網址：`/cat-sync/`（首頁也有入口）
- 遊戲位於 `cat-sync/index.html`，與原本的貓咪性格測驗分開，不會共用原本 Supabase 的資料。
- 多人連線需另外設定 Firebase；請閱讀 `cat-sync/README.md`。
- 在 Firebase 設定完成之前，遊戲頁面可以開啟，但無法建立多人房間。
