-- Mirror frontend confirmation rules when audit triggers classify copy counts.
-- Unapproved imported eBay purchase copies are NOT counted unless explicitly true.
-- This updates only future audit behavior and does not modify physical inventory.
DO $guard$
DECLARE
  definition text;
  prev_old text := 'coalesce((prev->>''currentInventory'')::boolean,true)';
  next_old text := 'coalesce((next_row->>''currentInventory'')::boolean,true)';
  prev_new text := $expr$coalesce((prev->>'currentInventory')::boolean,
        NOT (prev->>'origin' = 'purchase' AND (
          lower(coalesce(prev->>'source','')) = 'ebay'
          OR copy_key LIKE 'purchase:ebay:%'
          OR coalesce(prev->>'sourceUrl','') ~* 'ebay\.(com|ca|co\.uk)'
        )))$expr$;
  next_new text := $expr$coalesce((next_row->>'currentInventory')::boolean,
        NOT (next_row->>'origin' = 'purchase' AND (
          lower(coalesce(next_row->>'source','')) = 'ebay'
          OR copy_key LIKE 'purchase:ebay:%'
          OR coalesce(next_row->>'sourceUrl','') ~* 'ebay\.(com|ca|co\.uk)'
        )))$expr$;
BEGIN
  SELECT pg_get_functiondef('private.tb_audit_private_copies()'::regprocedure)
  INTO definition;
  IF position('NOT (prev->>''origin'' = ''purchase''' IN definition)>0 THEN
    RETURN;
  END IF;
  IF position(prev_old IN definition)=0 OR position(next_old IN definition)=0 THEN
    RAISE EXCEPTION 'Unexpected copy audit function, refusing replacement';
  END IF;
  definition := replace(definition,prev_old,prev_new);
  definition := replace(definition,next_old,next_new);
  EXECUTE definition;
END
$guard$;