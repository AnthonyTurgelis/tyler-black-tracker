do $audit_fix$
declare definition text;
begin
  select pg_get_functiondef('private.tb_audit_private_copies()'::regprocedure) into definition;
  if position('if old_live is distinct from new_live then' in definition)=0
     then raise exception 'Expected audit condition not found'; end if;
  definition := replace(definition,
    'if old_live is distinct from new_live then',
    'if old_live is distinct from new_live and not (prev is null and next_row->>''origin''=''legacy'') then');
  execute definition;
end
$audit_fix$;