-- V6.11 免費測試紀錄後台
-- 只記錄解析摘要，不儲存出生日期、出生時間、經緯度。
-- 執行完成後可在 Table Editor 看到 public.free_test_records。

begin;

create table if not exists public.free_test_records (
  id uuid primary key default gen_random_uuid(),
  nickname text,
  life_path integer,
  life_name text,
  sun text,
  moon text,
  rising text,
  hd_type text,
  hd_authority text,
  hd_profile text,
  day_master text,
  access_type text not null default '免費',
  created_at timestamptz not null default now()
);

alter table public.free_test_records enable row level security;

-- 不讓網站訪客直接讀取整張紀錄表
revoke all on table public.free_test_records from anon, authenticated;

create or replace function public.record_free_test(
  p_nickname text default null,
  p_life_path integer default null,
  p_life_name text default null,
  p_sun text default null,
  p_moon text default null,
  p_rising text default null,
  p_hd_type text default null,
  p_hd_authority text default null,
  p_hd_profile text default null,
  p_day_master text default null,
  p_access_type text default '免費'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.free_test_records (
    nickname,
    life_path,
    life_name,
    sun,
    moon,
    rising,
    hd_type,
    hd_authority,
    hd_profile,
    day_master,
    access_type
  )
  values (
    nullif(trim(p_nickname), ''),
    p_life_path,
    p_life_name,
    p_sun,
    p_moon,
    p_rising,
    p_hd_type,
    p_hd_authority,
    p_hd_profile,
    p_day_master,
    coalesce(nullif(trim(p_access_type), ''), '免費')
  );

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.record_free_test(
  text, integer, text, text, text, text, text, text, text, text, text
) from public;

grant execute on function public.record_free_test(
  text, integer, text, text, text, text, text, text, text, text, text
) to anon, authenticated;

commit;

-- 測試查看（只有你在 SQL Editor / Table Editor 後台看得到）
select
  created_at as "測試時間",
  coalesce(nickname, '未填暱稱') as "暱稱",
  life_path as "生命靈數",
  life_name as "生命主題",
  sun as "太陽",
  moon as "月亮",
  rising as "上升",
  hd_type as "人類圖",
  day_master as "日主",
  access_type as "狀態"
from public.free_test_records
order by created_at desc;
