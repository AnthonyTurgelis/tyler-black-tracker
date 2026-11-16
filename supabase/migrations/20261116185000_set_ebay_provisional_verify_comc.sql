
begin;
do $fix$
declare
  v jsonb;
  next_v jsonb;
  k text;
  current_obj jsonb;
  src text;
  at_iso text := to_char(clock_timestamp() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
  keys text[] := array[
    'purchase:ebay:order:24-15031-53294:item:800484042574:1',
    'purchase:ebay:order:19-14631-53054:item:406927066437:1:unit:6',
    'purchase:ebay:order:12-14941-44470:item:178337927283:1',
    'purchase:comc:319870121',
    'purchase:comc:319865597'
  ];
begin
  select value into v from public.collection_private_kv
    where key='tb-copy-inventory-v1' for update;
  if v is null then raise exception 'No copy inventory'; end if;
  next_v := v;
  foreach k in array keys loop
    current_obj := next_v#>array['copies',k];
    if current_obj is null then raise exception 'Missing copy %',k; end if;
    if current_obj->>'currentInventory' is not null then
      raise exception 'Copy % already explicitly confirmed/provisional; stop to review',k;
    end if;
    src := case when k like 'purchase:comc:%' then 'comc' else 'ebay' end;
    if current_obj->>'origin'<>'purchase' or current_obj->>'location' is distinct from
         (case when src='comc' then 'comc' else 'unknown' end)
      then raise exception 'Copy % no longer matches baseline',k;
    end if;
    current_obj := current_obj ||
      jsonb_build_object('currentInventory',(src='comc'),
          'source',src,'updatedAt',at_iso,
          'locationEvidence',case when src='comc' then
            'COMC inventory-linked copy; source record verified in the tracker. Not in hand.'
          else 'Purchased record only. Excluded from collection total until user confirms retained physical copy and no duplicate counting.' end);
    if src='comc' then
      current_obj := current_obj || jsonb_build_object('sourceItemId',split_part(k,':',3),
        'sourceUrl','https://www.comc.com/item/'||split_part(k,':',3));
    end if;
    next_v:=jsonb_set(next_v,array['copies',k],current_obj,false);
  end loop;
  next_v := jsonb_set(next_v,array['updatedAt'],to_jsonb(at_iso),false);
  update public.collection_private_kv set value=next_v where key='tb-copy-inventory-v1';
end $fix$;
commit;