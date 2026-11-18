-- Check actual production key permission, owner isolation and revision CAS.
-- All changes (including first-row creation) roll back.
begin;
select set_config('request.jwt.claim.sub',owner_id::text,true)
from public.collection_private_kv where key='tb-copy-inventory-v1' limit 1;
set local role authenticated;
do $$
declare
  tb_before jsonb;
  tempo_before record;
  next_revision bigint;
  changed integer;
begin
  select value into strict tb_before from public.collection_private_kv where owner_id=auth.uid() and key='tb-copy-inventory-v1';
  insert into public.collection_private_kv(owner_id,key,value)
    values(auth.uid(),'tempo-autographs-v1','{"version":1,"records":{},"history":[]}'::jsonb)
    on conflict(owner_id,key) do nothing;
  insert into public.collection_private_kv(owner_id,key,value) values(auth.uid(),'collect-racing-autographs-v1','{"version":1,"records":{},"history":[]}'::jsonb) on conflict(owner_id,key) do nothing;
  select * into strict tempo_before from public.collection_private_kv where owner_id=auth.uid() and key='tempo-autographs-v1';
  update public.collection_private_kv set value=value||'{"_scopeTest":true}'::jsonb
    where owner_id=auth.uid() and key='tempo-autographs-v1' and revision=tempo_before.revision
    returning revision into strict next_revision;
  if next_revision<>tempo_before.revision+1 then raise exception 'Tempo autograph revision did not advance'; end if;
  update public.collection_private_kv set value=tempo_before.value
    where owner_id=auth.uid() and key='tempo-autographs-v1' and revision=tempo_before.revision;
  get diagnostics changed=row_count;
  if changed<>0 then raise exception 'Stale Tempo autograph revision was accepted'; end if;
  if tb_before is distinct from (select value from public.collection_private_kv where owner_id=auth.uid() and key='tb-copy-inventory-v1') then
    raise exception 'Tyler copy inventory changed while saving Tempo';
  end if;
end $$;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
do $$ begin
  if exists(select 1 from public.collection_private_kv where key in ('tb-copy-inventory-v1','tempo-autographs-v1','collect-racing-autographs-v1')) then
    raise exception 'Another account can read private autographs';
  end if;
end $$;
reset role;
rollback;
