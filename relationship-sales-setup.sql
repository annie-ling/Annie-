-- V4｜NT$149 感情解析：專屬解鎖碼 + 轉換漏斗紀錄
-- 在 Supabase > SQL Editor 整份執行一次。
-- 不儲存生日、姓名或感情測驗答案；漏斗只記錄匿名裝置 token 與事件。

begin;
create extension if not exists pgcrypto;

create table if not exists public.relationship_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text,
  active boolean not null default true,
  max_uses integer not null default 1 check (max_uses >= 1),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.relationship_licenses (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.relationship_codes(id) on delete cascade,
  device_token text not null unique,
  revoked boolean not null default false,
  activated_at timestamptz not null default now()
);
create table if not exists public.relationship_funnel_events (
  id bigint generated always as identity primary key,
  device_token text not null,
  event_name text not null check (event_name in ('result_view','pay_click','paid_unlock')),
  created_at timestamptz not null default now()
);

alter table public.relationship_codes enable row level security;
alter table public.relationship_licenses enable row level security;
alter table public.relationship_funnel_events enable row level security;
revoke all on table public.relationship_codes, public.relationship_licenses, public.relationship_funnel_events from anon, authenticated;

create or replace function public.activate_relationship_code(p_code text, p_device_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_code public.relationship_codes%rowtype; v_existing public.relationship_licenses%rowtype; v_hash text;
begin
  if p_code is null or btrim(p_code)='' or p_device_token is null or btrim(p_device_token)='' then return jsonb_build_object('ok',false,'reason','invalid'); end if;
  v_hash:=encode(digest(upper(btrim(p_code)),'sha256'),'hex');
  select * into v_code from public.relationship_codes where code_hash=v_hash for update;
  if not found then return jsonb_build_object('ok',false,'reason','invalid'); end if;
  if not v_code.active then return jsonb_build_object('ok',false,'reason','inactive'); end if;
  if v_code.expires_at is not null and v_code.expires_at<now() then return jsonb_build_object('ok',false,'reason','expired'); end if;
  select * into v_existing from public.relationship_licenses where device_token=p_device_token;
  if found then
    if v_existing.code_id=v_code.id and not v_existing.revoked then return jsonb_build_object('ok',true,'already_active',true); end if;
    return jsonb_build_object('ok',false,'reason','used');
  end if;
  if v_code.used_count>=v_code.max_uses then return jsonb_build_object('ok',false,'reason','used'); end if;
  insert into public.relationship_licenses(code_id,device_token) values(v_code.id,p_device_token);
  update public.relationship_codes set used_count=used_count+1 where id=v_code.id;
  return jsonb_build_object('ok',true,'already_active',false);
end; $$;

create or replace function public.check_relationship_license(p_device_token text)
returns boolean language sql security definer set search_path=public as $$
  select exists(select 1 from public.relationship_licenses l join public.relationship_codes c on c.id=l.code_id where l.device_token=p_device_token and not l.revoked and c.active and (c.expires_at is null or c.expires_at>=now()));
$$;

create or replace function public.record_relationship_event(p_event text,p_device_token text)
returns jsonb language plpgsql security definer set search_path=public as $$
begin
  if p_event not in ('result_view','pay_click','paid_unlock') or p_device_token is null or btrim(p_device_token)='' then return jsonb_build_object('ok',false); end if;
  insert into public.relationship_funnel_events(device_token,event_name) values(p_device_token,p_event);
  return jsonb_build_object('ok',true);
end; $$;

grant execute on function public.activate_relationship_code(text,text) to anon, authenticated;
grant execute on function public.check_relationship_license(text) to anon, authenticated;
grant execute on function public.record_relationship_event(text,text) to anon, authenticated;

create or replace function public.admin_create_relationship_code(p_code text,p_label text default null,p_max_uses integer default 1,p_expires_at timestamptz default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_id uuid; begin
  insert into public.relationship_codes(code_hash,label,max_uses,expires_at) values(encode(digest(upper(btrim(p_code)),'sha256'),'hex'),p_label,greatest(1,p_max_uses),p_expires_at) returning id into v_id; return v_id;
end; $$;
revoke all on function public.admin_create_relationship_code(text,text,integer,timestamptz) from public,anon,authenticated;
commit;

-- 【收到 NT$149 後】建立一組只給該客人的代碼（自行換代碼與標籤）：
-- select public.admin_create_relationship_code('LOVE-A7K9-Q2MX','客人暱稱 / 2026-09-20',1,'2027-12-31 23:59:59+08');

-- 【看轉換漏斗】每個階段的不重複裝置數：
select event_name, count(distinct device_token) as users from public.relationship_funnel_events group by event_name order by event_name;

-- 【看代碼使用狀態】：
-- select id,label,active,max_uses,used_count,expires_at,created_at from public.relationship_codes order by created_at desc;
