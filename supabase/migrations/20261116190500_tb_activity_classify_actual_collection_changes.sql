
alter table public.tb_collection_activity
 add column if not exists impact_kind text generated always as (
  case
   when category='status' then
     case
       when old_value='in_transit' and new_value='owned' then 'transit_to_owned'
       when old_value='owned' and new_value='in_transit' then 'owned_to_transit'
       when old_value='not_owned' and new_value='owned' then 'added_owned'
       when old_value='not_owned' and new_value='in_transit' then 'added_transit'
       when old_value in ('owned','in_transit') and new_value='not_owned' then 'removed'
       else 'status_other'
     end
   when category='qty' then
     case
       when old_value ~ '^[0-9]{1,6}$' and new_value ~ '^[0-9]{1,6}$' and old_value::numeric < new_value::numeric then 'qty_up'
       when old_value ~ '^[0-9]{1,6}$' and new_value ~ '^[0-9]{1,6}$' and old_value::numeric > new_value::numeric then 'qty_down'
       else 'qty_set'
     end
   when category='location' then
     case
       when new_value='in_hand' and old_value is distinct from 'in_hand' then 'location_to_hand'
       when old_value='in_hand' and new_value is distinct from 'in_hand' then 'location_left_hand'
       else 'location_move'
     end
   when category='copy' and field='Counted' and new_value='Yes' then 'count_added'
   when category='copy' and field='Counted' and new_value='No' then 'count_removed'
   else null
  end
 ) stored;
create index if not exists tb_collection_activity_owner_impact_idx
 on public.tb_collection_activity(owner_id,impact_kind,changed_at desc)
 where impact_kind is not null;
comment on column public.tb_collection_activity.impact_kind is
 'Classification of actual status/quantity/location/count changes; does not treat imported source, pre-existing copy mapping, or evidence uploads as ownership changes.';
