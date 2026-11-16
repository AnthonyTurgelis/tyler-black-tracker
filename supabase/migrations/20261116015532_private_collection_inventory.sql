create table public.collection_private_kv (
  owner_id uuid not null references auth.users(id) on delete cascade,
  key text not null check (char_length(key) between 1 and 200),
  value jsonb not null,
  updated_at timestamptz not null default clock_timestamp(),
  revision bigint not null default 1,
  primary key (owner_id, key)
);
alter table public.collection_private_kv enable row level security;
alter table public.collection_private_kv force row level security;
revoke all on table public.collection_private_kv from public, anon, authenticated;
grant select, insert, update on table public.collection_private_kv to authenticated;
grant all on table public.collection_private_kv to service_role;
create policy private_collection_select on public.collection_private_kv for select to authenticated using ((select auth.uid()) = owner_id);
create policy private_collection_insert on public.collection_private_kv for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy private_collection_update on public.collection_private_kv for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create function public.touch_collection_private_kv() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  new.updated_at := greatest(clock_timestamp(), old.updated_at + interval '1 microsecond');
  new.revision := old.revision + 1;
  return new;
end;
$$;
revoke all on function public.touch_collection_private_kv() from public, anon;
grant execute on function public.touch_collection_private_kv() to authenticated, service_role;
create trigger collection_private_kv_touch before update on public.collection_private_kv for each row execute function public.touch_collection_private_kv();
comment on table public.collection_private_kv is 'Private per-owner inventory and purchase reconciliation. Never mirrored into public collection_kv or anonymous local caches.';
