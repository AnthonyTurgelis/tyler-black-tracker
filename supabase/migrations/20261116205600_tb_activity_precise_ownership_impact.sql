-- Keep history useful for ownership review, without treating metadata backfills as new copies.
-- impact_kind is a generated stored field: BEFORE INSERT cannot directly set its final value.
ALTER TABLE public.tb_collection_activity
ALTER COLUMN impact_kind SET EXPRESSION AS (
  CASE
    WHEN category = 'status' THEN CASE
      WHEN old_value = 'in_transit' AND new_value IN ('owned','for_sale') THEN 'transit_to_owned'
      WHEN old_value IN ('owned','for_sale') AND new_value = 'in_transit' THEN 'owned_to_transit'
      WHEN old_value IN ('not_owned','') AND new_value IN ('owned','for_sale') THEN 'added_owned'
      WHEN old_value IN ('not_owned','') AND new_value = 'in_transit' THEN 'added_transit'
      WHEN old_value IN ('owned','in_transit','for_sale') AND new_value IN ('not_owned','') THEN 'removed'
      ELSE 'status_other' END
    WHEN category = 'qty' THEN CASE
      WHEN old_value ~ '^[0-9]{1,12}$' AND new_value ~ '^[0-9]{1,12}$'
        AND old_value::numeric < new_value::numeric THEN 'qty_up'
      WHEN old_value ~ '^[0-9]{1,12}$' AND new_value ~ '^[0-9]{1,12}$'
        AND old_value::numeric > new_value::numeric THEN 'qty_down'
      WHEN old_value ~ '^[0-9]{1,12}$' AND (new_value IS NULL OR new_value = '') THEN 'qty_unset'
      ELSE 'qty_set' END
    WHEN category = 'location' THEN CASE
      WHEN old_value IN ('comc','in_transit','oklahoma_mailbox') AND new_value = 'in_hand' THEN 'location_to_hand'
      WHEN old_value = 'in_hand' AND new_value IS DISTINCT FROM 'in_hand' THEN 'location_left_hand'
      WHEN (old_value IS NULL OR old_value IN ('','unknown','Unallocated')) AND new_value = 'in_hand' THEN 'location_assigned_hand'
      WHEN (old_value IS NULL OR old_value IN ('','unknown','Unallocated'))
        AND new_value IN ('comc','in_transit','oklahoma_mailbox') THEN 'location_assigned_transit'
      ELSE 'location_move' END
    WHEN category = 'copy' AND field = 'Counted' THEN CASE
      WHEN new_value = 'Yes' AND old_value IS DISTINCT FROM 'Yes' THEN 'count_added'
      WHEN new_value = 'No' AND old_value IS DISTINCT FROM 'No' THEN 'count_removed'
      ELSE NULL END
    ELSE NULL
  END
);
-- Annotate origin on incoming site/backend events without claiming physical verification.
CREATE OR REPLACE FUNCTION private.tb_note_ownership_activity_origin()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $fn$
BEGIN
  IF NEW.evidence_level IS NULL
    AND NEW.actor IN ('Site','Backend')
    AND NEW.category IN ('status','qty','location','copy')
    AND (NEW.category <> 'copy' OR NEW.field = 'Counted')
    AND NEW.old_value IS DISTINCT FROM NEW.new_value THEN
    IF NEW.actor = 'Site' THEN
      NEW.evidence_level := 'site_recorded';
    ELSE
      NEW.evidence_level := 'backend_unverified';
      IF NEW.evidence_note IS NULL THEN
        NEW.evidence_note := 'Backend ownership or quantity edit; verify against confirmed inventory evidence.';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END
$fn$;
DROP TRIGGER IF EXISTS tb_classify_ownership_activity ON public.tb_collection_activity;
DROP FUNCTION IF EXISTS private.tb_classify_ownership_activity();
DROP TRIGGER IF EXISTS tb_note_ownership_activity_origin ON public.tb_collection_activity;
CREATE TRIGGER tb_note_ownership_activity_origin
BEFORE INSERT ON public.tb_collection_activity
FOR EACH ROW EXECUTE FUNCTION private.tb_note_ownership_activity_origin();
ANALYZE public.tb_collection_activity;
