# 數字裡的你｜生命靈數探索

一個可直接部署到 GitHub Pages 的靜態生命靈數網站。

## 功能

- 輸入西元出生日期
- 自動計算生命靈數
- 保留大師數 11 / 22 / 33
- 顯示個性、天賦、感情、金錢、卡點、人生課題
- 自動計算 2026 個人流年
- 響應式手機版設計

## GitHub Pages 發布方式

1. 在 GitHub 建立新的 Repository
2. 將 `index.html`、`style.css`、`script.js` 上傳到 Repository 根目錄
3. 進入 `Settings`
4. 點選 `Pages`
5. `Build and deployment` 選擇 `Deploy from a branch`
6. Branch 選擇 `main` / `(root)`
7. 儲存後即可取得公開網址

## 修改完整版解析按鈕

請在 `index.html` 找到：

```html
<a class="secondary-btn" href="#" ...>解鎖完整解析</a>
```

把 `href="#"` 改成你的 Beacons、LINE、商品頁面或付款頁面連結。

## 注意

本網站目前使用常見生命靈數算法：
將西元出生年月日所有數字相加，持續化簡至 1–9；若中途結果為 11、22、33，則保留為大師數。

內容屬於自我探索與娛樂用途。
