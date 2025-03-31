
-- Crear una vista mejorada para los reports públicos que incluya
-- todo el contenido necesario para una correcta visualización
DROP VIEW IF EXISTS public_reports CASCADE;

CREATE OR REPLACE VIEW public_reports AS
SELECT 
  r.id,
  r.title,
  r.summary,
  r.url,
  r.status,
  r.content,
  r.date,
  r.shared_url,
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
LEFT JOIN
  clients c ON r.client_id = c.id;

-- Conceder permisos explícitos a usuarios anónimos y autenticados
-- para acceder a la vista pública y a las tablas relacionadas
GRANT SELECT ON TABLE public_reports TO anon, authenticated;
GRANT SELECT ON TABLE reports TO anon, authenticated;
GRANT SELECT ON TABLE shared_content TO anon, authenticated;

-- Crear una función para obtener reportes por ID o URL compartida
CREATE OR REPLACE FUNCTION public.get_report_by_shared_url(url_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_data jsonb;
BEGIN
  -- Intentar obtener desde shared_content
  SELECT 
    jsonb_build_object(
      'id', sc.id,
      'title', sc.title,
      'summary', sc.description,
      'content', sc.content,
      'status', sc.status,
      'client_name', sc.client_name,
      'client_website', sc.client_website,
      'date', sc.created_at
    ) INTO report_data
  FROM 
    shared_content sc
  WHERE 
    sc.shared_url = url_id
    AND sc.content_type = 'report';
    
  -- Si no se encuentra en shared_content, intentar en reports
  IF report_data IS NULL THEN
    SELECT 
      jsonb_build_object(
        'id', r.id,
        'title', r.title,
        'summary', r.summary,
        'url', r.url,
        'content', r.content,
        'status', r.status,
        'client_name', c.name,
        'client_website', c.website,
        'date', r.date
      ) INTO report_data
    FROM 
      reports r
    LEFT JOIN
      clients c ON r.client_id = c.id
    WHERE 
      r.shared_url = url_id;
  END IF;
  
  RETURN report_data;
END;
$$;

-- Conceder permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION public.get_report_by_shared_url TO anon, authenticated;

-- Crear vista específica para informes compartidos
CREATE OR REPLACE VIEW shared_reports AS
SELECT 
  r.id,
  r.title,
  r.summary,
  r.url,
  r.status,
  r.content,
  r.date,
  r.shared_url,
  c.name as client_name,
  c.website as client_website
FROM 
  reports r
LEFT JOIN
  clients c ON r.client_id = c.id
WHERE 
  r.shared_url IS NOT NULL;

-- Conceder permisos a la vista de informes compartidos
GRANT SELECT ON TABLE shared_reports TO anon, authenticated;
