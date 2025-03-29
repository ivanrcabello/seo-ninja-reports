
-- Create or replace a function to get public invoice data by shared URL
-- This fixes the previous issue with single row requirement
CREATE OR REPLACE FUNCTION public.get_public_invoice_by_shared_url(shared_url_param uuid)
RETURNS TABLE(
  id uuid, 
  title text, 
  description text, 
  amount numeric, 
  status text, 
  due_date timestamp with time zone, 
  payment_method text, 
  payment_date timestamp with time zone, 
  payment_instructions text,
  shared_url uuid, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  client_name text, 
  client_website text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.title,
    ci.description,
    ci.amount,
    ci.status,
    ci.due_date,
    ci.payment_method,
    ci.payment_date,
    ci.payment_instructions,
    ci.shared_url,
    ci.created_at,
    ci.updated_at,
    c.name as client_name,
    c.website as client_website
  FROM 
    client_invoices ci
  JOIN
    clients c ON ci.client_id = c.id
  WHERE 
    ci.shared_url = shared_url_param;
END;
$$;
