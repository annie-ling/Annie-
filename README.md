## V6.11｜免費測試紀錄後台

新增 `free_test_records` 後台紀錄表。網站只會送出：
- 暱稱（選填）
- 生命靈數與主題
- 太陽／月亮／上升
- 人類圖類型／權威／角色
- 八字日主
- 免費／Premium 狀態
- 測試時間

**不儲存出生日期、出生時間、經緯度。**

部署前請先到 Supabase SQL Editor 執行 `free-test-tracking.sql`。

## V6.10
已完整移除「列印／儲存 PDF」按鈕、列印事件與 PDF 銷售文字。

## V6.5 RPC 除錯修正版\n- Publishable key 僅放 apikey header\n- 支援 Supabase 回傳 success/message\n- 驗證錯誤會直接顯示於網頁，方便定位\n\n# 玄學人格研究所 V6 Premium｜獨立授權碼版

這版把 V5.2 的「共用前端密碼」升級成 Supabase 後端驗證。

## 客人流程
免費解析 → LINE 詢問／付款 → 你建立一組專屬碼 → 客人輸入 → 後端驗證 → 綁定該瀏覽器 → Premium 完整解析。

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



## Relationship V2
新增互相吸引原因、長期相處模式、關係成長課題，以及可透過系統分享/複製的戀愛關係卡。保留原個人解析、Premium 與追蹤功能。

## V3.1｜NT$149 感情解析轉換測試
- 免費顯示：契合度、雙方感情需求、最容易卡住的地方。
- 付費鎖定：吵架模式、感情地雷、吸引原因、長期相處、成長課題、3 個相處方法。
- NT$149 按鈕導向 LINE；付款確認後，請為每位客人建立一組專屬解鎖碼。

## V4｜NT$149 正式銷售流程
1. 先在 Supabase SQL Editor 執行 `relationship-sales-setup.sql`。
2. 客人完成免費感情測驗後，網站會匿名記錄 `result_view`。
3. 客人點「前往 LINE｜解鎖 NT$149」會記錄 `pay_click`，並開啟 LINE。
4. 你確認收到 NT$149 後，在 Supabase SQL Editor 執行：
   `select public.admin_create_relationship_code('LOVE-A7K9-Q2MX','客人暱稱 / 日期',1,'2027-12-31 23:59:59+08');`
   請每位客人換一組不同代碼。
5. 把代碼傳給客人。客人回網站輸入後，會綁定該瀏覽器／裝置並展開完整感情解析。
6. 正式解鎖會匿名記錄 `paid_unlock`；網站前台不含任何公開測試碼或測試後門。
7. 在 Supabase Table Editor 可看 `relationship_codes`、`relationship_licenses`、`relationship_funnel_events`。也可執行 SQL 檔最下方的查詢看漏斗人數。

注意：這版是「LINE 人工確認付款 + 專屬一次性碼」，不是自動金流。不要把 Supabase service-role key 放進網站；目前前端只使用 publishable key。

## V6｜安全銷售管理後台
新增 `admin.html` 管理頁，管理員登入後可以：
- 看免費結果人數、NT$149 點擊數、付費解鎖數與轉換率
- 一鍵產生每位客人的隨機專屬解鎖碼
- 設定可啟用裝置數與到期日
- 查看最近代碼使用狀態
- 停用／重新啟用代碼

### V5 升級 V6（不會清掉既有資料）
1. 先保留原本 V5 Supabase 資料。
2. 到 Supabase > SQL Editor 執行新的 `relationship-admin-setup.sql`。
3. 到 Supabase > Authentication > Users 建立「你自己的管理員帳號（Email + Password）」。
4. 複製該帳號的 User UID。
5. 回 SQL Editor 執行：
   `insert into public.relationship_admins(user_id) values ('你的 User UID') on conflict do nothing;`
6. 將 V6 全部檔案上傳 GitHub 覆蓋舊版。
7. 網址最後加 `/admin.html` 進入管理後台。

安全提醒：V6 沒有把站長測試碼、管理密碼或 service-role key 寫進公開網站。管理權限由 Supabase Auth + 後端 RPC 驗證。
