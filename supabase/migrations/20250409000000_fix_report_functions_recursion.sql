
-- Reemplazar las funciones existentes con versiones que eviten la recursión

-- Function to check if a report is password protected (versión corregida)
CREATE OR REPLACE FUNCTION public.check_report_password_protection(report_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_protected boolean;
BEGIN
  -- Usamos auth.uid() = auth.uid() como una condición siempre verdadera para bypasear RLS temporalmente
  SELECT (password IS NOT NULL AND password != '') INTO is_protected
  FROM reports
  WHERE id = report_id_param
  AND (SELECT 1 WHERE auth.uid() = auth.uid() OR auth.uid() IS NULL);
  
  RETURN COALESCE(is_protected, false);
END;
$$;

-- Function to verify a report password (versión corregida)
CREATE OR REPLACE FUNCTION public.verify_shared_report_password(report_id_param uuid, password_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  valid boolean;
BEGIN
  -- Usamos auth.uid() = auth.uid() como una condición siempre verdadera para bypasear RLS temporalmente
  SELECT (password = password_param) INTO valid
  FROM reports
  WHERE id = report_id_param
  AND (SELECT 1 WHERE auth.uid() = auth.uid() OR auth.uid() IS NULL);
  
  RETURN COALESCE(valid, false);
END;
$$;

-- Asegurarse de que la función get_report_by_shared_url también sea SECURITY DEFINER
-- para evitar problemas de RLS
CREATE OR REPLACE FUNCTION public.get_report_by_shared_url(shared_url_param uuid)
RETURNS TABLE(id uuid, title text, summary text, url text, status text, content jsonb, date timestamp with time zone, client_name text, client_website text, shared_url uuid, password text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.summary,
    r.url,
    r.status,
    r.content,
    r.date,
    r.client_name,
    r.client_website,
    r.shared_url,
    r.password
  FROM 
    public_reports r
  WHERE 
    r.shared_url = shared_url_param;
END;
$$;

-- Crear una vista para acceso público a reports (si no existe)
CREATE VIEW IF NOT EXISTS public_reports AS
SELECT 
  r.id,
  r.title,
  r.summary,
  r.url,
  r.status,
  r.content,
  r.date,
  r.shared_url,
  r.password,
  r.updated_at,
  r.created_at,
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
JOIN
  clients c ON r.client_id = c.id;
