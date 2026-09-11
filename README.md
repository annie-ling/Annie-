# 玄學人格研究所 V3.1｜iPhone 覆蓋版

這版是 V3 的修正版，直接覆蓋原本 Repository 根目錄檔案即可。

## V3.1 修正
- 修正星盤「主導元素」出現 `[object Object]`
- 八字日主改為繁中，例如 `庚金`，不再出現 `(geng)`
- Human Design 策略繁中化，例如 `Wait to Respond → 等待回應`
- 新增生命靈數、星盤、人類圖、八字的「深度解析」
- 保留原有 GitHub Actions，不需要重新建立 Pages workflow

## iPhone 更新方式
把以下 6 個檔案上傳到 Repository 根目錄並覆蓋同名檔案：
- index.html
- main.js
- style.css
- package.json
- vite.config.js
- README.md

`.github/workflows/pages.yml` 不需要動。

## 更新後
Commit 之後 GitHub Actions 會自動重新部署。
看到綠燈後，重新整理 GitHub Pages 網站即可。
