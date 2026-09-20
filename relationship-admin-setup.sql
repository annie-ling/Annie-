-- V6｜感情解析安全管理後台
-- 先確認 V5 的 relationship-sales-setup.sql 已執行，再執行本檔。
-- 管理員身分使用 Supabase Auth user UUID，不把管理密碼寫進網站。

begin;

create table if not exists public.relationship_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.relationship_admins enable row level security;
revoke all on table public.relationship_admins from anon, authenticated;

create or replace function public.is_relationship_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.relationship_admins where user_id=auth.uid());
$$;
revoke all on function public.is_relationship_admin() from public,anon;
grant execute on function public.is_relationship_admin() to authenticated;

create or replace function public.admin_relationship_dashboard()
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_result bigint; v_click bigint; v_paid bigint; v_active bigint;
begin
  if not public.is_relationship_admin() then raise exception 'not_authorized'; end if;
  select count(distinct device_token) into v_result from public.relationship_funnel_events where event_name='result_view';
  select count(distinct device_token) into v_click from public.relationship_funnel_events where event_name='pay_click';
  select count(distinct device_token) into v_paid from public.relationship_funnel_events where event_name='paid_unlock';
  select count(*) into v_active from public.relationship_codes where active and (expires_at is null or expires_at>=now());
  return jsonb_build_object(
    'result_view',v_result,'pay_click',v_click,'paid_unlock',v_paid,'active_codes',v_active,
    'click_rate',case when v_result>0 then round(v_click::numeric*100/v_result,1) else 0 end,
    'paid_rate',case when v_result>0 then round(v_paid::numeric*100/v_result,1) else 0 end
  );
end; $$;
revoke all on function public.admin_relationship_dashboard() from public,anon;
grant execute on function public.admin_relationship_dashboard() to authenticated;

create or replace function public.admin_generate_relationship_code(
  p_label text default null,
  p_max_uses integer default 1,
  p_expires_at timestamptz default null
) returns jsonb language plpgsql security definer set search_path=public as $$
declare v_code text; v_id uuid;
begin
  if not public.is_relationship_admin() then raise exception 'not_authorized'; end if;
  v_code := 'LOVE-' || upper(substr(encode(gen_random_bytes(5),'hex'),1,4)) || '-' || upper(substr(encode(gen_random_bytes(5),'hex'),1,4)) || '-' || upper(substr(encode(gen_random_bytes(5),'hex'),1,4));
  insert into public.relationship_codes(code_hash,label,max_uses,expires_at)
  values(encode(digest(upper(v_code),'sha256'),'hex'),nullif(btrim(p_label),''),greatest(1,coalesce(p_max_uses,1)),p_expires_at)
  returning id into v_id;
  return jsonb_build_object('id',v_id,'code',v_code);
end; $$;
revoke all on function public.admin_generate_relationship_code(text,integer,timestamptz) from public,anon;
grant execute on function public.admin_generate_relationship_code(text,integer,timestamptz) to authenticated;

create or replace function public.admin_list_relationship_codes()
returns table(id uuid,label text,active boolean,max_uses integer,used_count integer,expires_at timestamptz,created_at timestamptz)
language plpgsql security definer set search_path=public as $$
begin
  if not public.is_relationship_admin() then raise exception 'not_authorized'; end if;
  return query select c.id,c.label,c.active,c.max_uses,c.used_count,c.expires_at,c.created_at from public.relationship_codes c order by c.created_at desc limit 100;
end; $$;
revoke all on function public.admin_list_relationship_codes() from public,anon;
grant execute on function public.admin_list_relationship_codes() to authenticated;

create or replace function public.admin_set_relationship_code_active(p_id uuid,p_active boolean)
returns boolean language plpgsql security definer set search_path=public as $$
begin
  if not public.is_relationship_admin() then raise exception 'not_authorized'; end if;
  update public.relationship_codes set active=p_active where id=p_id;
  return found;
end; $$;
revoke all on function public.admin_set_relationship_code_active(uuid,boolean) from public,anon;
grant execute on function public.admin_set_relationship_code_active(uuid,boolean) to authenticated;

commit;

-- 【只做一次】
-- 1. Supabase > Authentication > Users 建立你自己的管理員帳號（Email + Password）。
-- 2. 點進該帳號，複製 User UID。
-- 3. 把下面 YOUR_AUTH_USER_UUID 換成你的 UID 後執行：
-- insert into public.relationship_admins(user_id) values ('YOUR_AUTH_USER_UUID') on conflict do nothing;
