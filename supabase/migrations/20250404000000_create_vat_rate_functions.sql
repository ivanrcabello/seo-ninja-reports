
-- Create a function to get the VAT rate
CREATE OR REPLACE FUNCTION public.get_vat_rate()
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rate NUMERIC;
BEGIN
  SELECT vat_rate INTO rate FROM public.settings WHERE id = 1;
  RETURN COALESCE(rate, 21); -- Default to 21% if not set
END;
$$;

-- Create a function to update the VAT rate
CREATE OR REPLACE FUNCTION public.update_vat_rate(new_rate NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.settings SET vat_rate = new_rate WHERE id = 1;
END;
$$;
