## V6.5 RPC 除錯修正版\n- Publishable key 僅放 apikey header\n- 支援 Supabase 回傳 success/message\n- 驗證錯誤會直接顯示於網頁，方便定位\n\n# 玄學人格研究所 V6 Premium｜獨立授權碼版

這版把 V5.2 的「共用前端密碼」升級成 Supabase 後端驗證。

## 客人流程
免費解析 → LINE 詢問／付款 → 你建立一組專屬碼 → 客人輸入 → 後端驗證 → 綁定該瀏覽器 → Premium 完整解析＋PDF。

## 為什麼比 V5.2 安全
- 網頁原始碼不再放 `LING2027VIP` 這種共用密碼。
- 每位客人可以使用不同代碼。
- 可設定每組碼最多使用幾次與到期日。
- 代碼在資料庫以 SHA-256 雜湊保存。
- 客人不能直接讀取代碼資料表。
- 可在 Supabase 後台停用代碼或撤銷授權。

> 注意：網站仍是 GitHub Pages 靜態前端，所以這是「授權層」升級，不是銀行等級 DRM。真正要完全隱藏 Premium 生成邏輯，下一階段需把報告生成也移到伺服器端。

## 第一次設定（只做一次）
1. 建立 Supabase 專案。
2. 在 Supabase 的 SQL Editor 開啟 `supabase-setup.sql`，整份貼上並執行。
3. Supabase Project Settings / API 找到：
   - Project URL
   - anon / publishable key
4. 打開 `premium-config.js`：
   - 把 `https://YOUR_PROJECT.supabase.co` 換成你的 Project URL。
   - 把 `YOUR_SUPABASE_ANON_KEY` 換成 anon / publishable key。
5. 將本包全部檔案上傳到 GitHub repo 最外層，原本 `.github/workflows/pages.yml` 不要刪。
6. GitHub Actions 綠勾後，用 Safari 無痕模式測試。

## 每收到一筆付款，要怎麼建立客人的碼？
到 Supabase > SQL Editor 執行：

```sql
select public.admin_create_premium_code(
  'LING-9F7K-2QXP',
  '客人暱稱 2026-09-11',
  1,
  '2027-12-31 23:59:59+08'
);
```

`LING-9F7K-2QXP` 請每位客人換一組隨機碼。`1` 代表只允許一個瀏覽器啟用。

## 自己怎麼測？
1. 先用上面的 SQL 建立一組測試碼，例如 `TEST-2027-A8K2`。
2. Safari 無痕開網站並產生免費解析。
3. 輸入測試碼。
4. 成功後 Premium 會出現。
5. 同一組碼換另一個無痕視窗／裝置再啟用，若 `max_uses=1` 應顯示已達使用上限。
6. 原本已成功的瀏覽器重新整理後，會由後端確認並恢復 Premium 授權。

## PDF
網頁維持深色玄學風；列印／儲存 PDF 會使用白底、深色文字與低調金色重點。
