// V6 Premium 授權後端設定
// 1. 到 Supabase 建立專案
// 2. 將 Project URL 與 Publishable/anon key 貼到下面
// 3. anon key 本來就是前端可公開使用的金鑰；真正的權限由資料庫 RLS / RPC 控制
export const PREMIUM_API = {
  url: 'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
