
-- Create or replace a function to insert into public_reports table
-- This avoids type issues when inserting directly
CREATE OR REPLACE FUNCTION insert_public_report(report_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public_reports (
    id,
    title,
    summary,
    url,
    status,
    content,
    date,
    client_name,
    client_website
  )
  VALUES (
    (report_data->>'id')::uuid,
    report_data->>'title',
    report_data->>'summary',
    report_data->>'url',
    report_data->>'status',
    (report_data->'content')::jsonb,
    (report_data->>'date')::timestamp with time zone,
    report_data->>'client_name',
    report_data->>'client_website'
  );
END;
$$;

-- Create or replace a function to update the public_reports table
-- This avoids type issues when updating directly
CREATE OR REPLACE FUNCTION update_public_report(report_id uuid, report_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public_reports
  SET
    title = report_data->>'title',
    summary = report_data->>'summary',
    url = report_data->>'url',
    status = report_data->>'status',
    content = (report_data->'content')::jsonb,
    date = (report_data->>'date')::timestamp with time zone,
    client_name = report_data->>'client_name',
    client_website = report_data->>'client_website'
  WHERE
    id = report_id;
END;
$$;
