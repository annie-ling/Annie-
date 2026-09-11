-- 玄學人格研究所 V6：一次性／限次 Premium 解鎖碼
-- 在 Supabase Dashboard > SQL Editor 內完整執行一次。

create extension if not exists pgcrypto;

create table if not exists public.premium_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text,
  active boolean not null default true,
  max_uses integer not null default 1 check (max_uses >= 1),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.premium_licenses (
  id uuid primary key default gen_random_uuid(),
  code_id uuid not null references public.premium_codes(id) on delete cascade,
  device_token text not null unique,
  revoked boolean not null default false,
  activated_at timestamptz not null default now()
);

alter table public.premium_codes enable row level security;
alter table public.premium_licenses enable row level security;

-- 不建立 SELECT/INSERT/UPDATE policy：匿名前端不能直接讀寫資料表。
-- 只能透過下方 security definer RPC 驗證。

create or replace function public.activate_premium_code(p_code text, p_device_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.premium_codes%rowtype;
  v_existing public.premium_licenses%rowtype;
  v_hash text;
begin
  if p_code is null or btrim(p_code) = '' or p_device_token is null or btrim(p_device_token) = '' then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  v_hash := encode(digest(upper(btrim(p_code)), 'sha256'), 'hex');

  select * into v_code
  from public.premium_codes
  where code_hash = v_hash
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'reason', 'invalid');
  end if;

  if not v_code.active then
    return jsonb_build_object('ok', false, 'reason', 'inactive');
  end if;

  if v_code.expires_at is not null and v_code.expires_at < now() then
    return jsonb_build_object('ok', false, 'reason', 'expired');
  end if;

  select * into v_existing
  from public.premium_licenses
  where device_token = p_device_token;

  if found then
    if v_existing.code_id = v_code.id and not v_existing.revoked then
      return jsonb_build_object('ok', true, 'already_active', true);
    end if;
    return jsonb_build_object('ok', false, 'reason', 'used');
  end if;

  if v_code.used_count >= v_code.max_uses then
    return jsonb_build_object('ok', false, 'reason', 'used');
  end if;

  insert into public.premium_licenses(code_id, device_token)
  values (v_code.id, p_device_token);

  update public.premium_codes
  set used_count = used_count + 1
  where id = v_code.id;

  return jsonb_build_object('ok', true, 'already_active', false);
end;
$$;

create or replace function public.check_premium_license(p_device_token text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.premium_licenses l
    join public.premium_codes c on c.id = l.code_id
    where l.device_token = p_device_token
      and l.revoked = false
      and c.active = true
      and (c.expires_at is null or c.expires_at >= now())
  );
$$;

grant execute on function public.activate_premium_code(text,text) to anon, authenticated;
grant execute on function public.check_premium_license(text) to anon, authenticated;

-- 管理員建立代碼用。請只在 SQL Editor 執行，不要開放給前端角色。
create or replace function public.admin_create_premium_code(
  p_code text,
  p_label text default null,
  p_max_uses integer default 1,
  p_expires_at timestamptz default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  insert into public.premium_codes(code_hash,label,max_uses,expires_at)
  values (
    encode(digest(upper(btrim(p_code)), 'sha256'), 'hex'),
    p_label,
    greatest(1,p_max_uses),
    p_expires_at
  )
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.admin_create_premium_code(text,text,integer,timestamptz) from public, anon, authenticated;

-- 建立一組客人解鎖碼範例：
-- select public.admin_create_premium_code('LING-9F7K-2QXP', '王小美 2026-09-11', 1, '2027-12-31 23:59:59+08');
--
-- 查看使用狀態：
-- select id,label,active,max_uses,used_count,expires_at,created_at from public.premium_codes order by created_at desc;
--
-- 停用某組碼：
-- update public.premium_codes set active=false where id='代碼ID';
--
-- 撤銷某個裝置授權：
-- update public.premium_licenses set revoked=true where id='授權ID';
