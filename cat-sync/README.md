# 貓貓腦迴路：多人連線版

這是純 HTML/CSS/JavaScript 前端，使用 Firebase Authentication（匿名登入）與 Realtime Database 來同步手機。**沒有後端設定就無法跨手機玩**。

## 設定步驟
1. 前往 https://console.firebase.google.com/ 建立專案。
2. 專案設定 → 新增 Web 應用程式，複製 Firebase config。
3. Authentication → Sign-in method → 啟用 Anonymous（匿名登入）。
4. Build → Realtime Database → 建立資料庫，選擇適當區域。
5. Realtime Database → Rules，設定下列規則（適用於私人朋友測試，**不是公開商業網站的完整防濫用規則**）：

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": "auth != null && $roomId.matches(/^[A-Z2-9]{8}$/)",
        ".write": "auth != null && $roomId.matches(/^[A-Z2-9]{8}$/)",
        ".validate": "newData.hasChildren(['host','status','players'])"
      }
    }
  }
}
```

注意：這是方便試玩的簡易規則，知道房號的登入者可以修改房間資料；真正公開上線前，應改成只有房主能控制題目／回合、每位玩家只能寫自己的答案，並增加 App Check、速率限制及自動刪除舊房間。

6. 在 index.html 搜尋 `const firebaseConfig`，把 PASTE_ 開頭的值換成控制台的設定（databaseURL 必須是 Firebase 顯示的完整 URL）。
7. 將 index.html 放到 GitHub Pages / Firebase Hosting / 其他 HTTPS 靜態網站；每位朋友開同一個網址。Firebase 的 Authorized domains 視需要加入部署網域。
8. 房主建立房間並複製邀請連結，朋友加入後房主開始。

## 限制
- 一個房間一次一題；所有玩家都送出後自動揭曉；房主可提前揭曉、換題、結束。
- 遊戲題庫在前端，不上傳完整 LINE 原文；自訂題目會同步到 Firebase。
- 房間目前沒有自動清除，請定期從 Firebase Console 刪除舊房間。
- 房主關閉頁面後不會自動轉移房主；重新用同一個瀏覽器（保留匿名登入狀態）與房號返回。
- 同步依賴網路及 Firebase 服務；不能單靠本機雙擊 HTML 離線跨手機遊玩。
