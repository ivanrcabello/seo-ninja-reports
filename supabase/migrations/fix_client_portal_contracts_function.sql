
-- Fix the get_client_portal_contracts function which currently returns invoices
CREATE OR REPLACE FUNCTION public.get_client_portal_contracts(client_id_param UUID)
RETURNS SETOF client_portal_contracts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if client token exists
  IF current_setting('request.headers', true)::json->>'x-client-token' IS NULL THEN
    RETURN;
  END IF;

  -- Check if the token is valid for this client
  IF NOT EXISTS (
    SELECT 1
    FROM client_portal_sessions cps
    JOIN client_portal_accounts cpa ON cps.client_portal_account_id = cpa.id
    WHERE 
      cps.token = current_setting('request.headers', true)::json->>'x-client-token'
      AND cps.expires_at > now()
      AND cpa.is_active = true
      AND cpa.client_id = client_id_param
  ) THEN
    RETURN;
  END IF;

  -- Fix the query to return contracts instead of invoices
  RETURN QUERY
  SELECT * FROM client_portal_contracts
  WHERE client_id = client_id_param
  ORDER BY created_at DESC;
END;
$$;
