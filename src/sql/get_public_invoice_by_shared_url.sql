
-- This function is used to retrieve a public invoice by its shared URL
CREATE OR REPLACE FUNCTION get_public_invoice_by_shared_url(shared_url_param TEXT)
RETURNS SETOF JSON AS
$$
DECLARE
    invoice_record RECORD;
    client_record RECORD;
    result_json JSON;
BEGIN
    -- First check if it exists in the shared_content table (preferred source)
    SELECT * FROM shared_content 
    WHERE shared_url = shared_url_param AND content_type = 'invoice'
    INTO invoice_record;
    
    IF FOUND THEN
        -- Return from shared_content
        RETURN QUERY SELECT json_build_object(
            'id', invoice_record.id,
            'title', invoice_record.title,
            'description', invoice_record.description,
            'amount', (invoice_record.content->>'amount')::numeric,
            'status', COALESCE(invoice_record.content->>'status', 'pending'),
            'due_date', invoice_record.content->>'due_date',
            'payment_method', invoice_record.content->>'payment_method',
            'payment_date', invoice_record.content->>'payment_date',
            'payment_instructions', invoice_record.content->>'payment_instructions',
            'shared_url', invoice_record.shared_url,
            'created_at', invoice_record.created_at,
            'updated_at', invoice_record.updated_at,
            'client_name', invoice_record.client_name,
            'client_website', invoice_record.client_website,
            'client_address', invoice_record.content->>'client_address',
            'client_tax_id', invoice_record.content->>'client_tax_id',
            'billing_name', invoice_record.content->>'billing_name',
            'billing_tax_id', invoice_record.content->>'billing_tax_id',
            'billing_address', invoice_record.content->>'billing_address',
            'billing_email', invoice_record.content->>'billing_email',
            'includes_vat', (invoice_record.content->>'includes_vat')::boolean,
            'invoice_number', invoice_record.content->>'invoice_number'
        );
        RETURN;
    END IF;
    
    -- If not found in shared_content, check in client_invoices
    SELECT i.*, c.name as client_name, c.website as client_website
    FROM client_invoices i
    JOIN clients c ON i.client_id = c.id
    WHERE i.shared_url = shared_url_param
    INTO invoice_record;
    
    IF FOUND THEN
        -- Create and return the JSON
        RETURN QUERY SELECT json_build_object(
            'id', invoice_record.id,
            'title', invoice_record.title,
            'description', invoice_record.description,
            'amount', invoice_record.amount,
            'status', invoice_record.status,
            'due_date', invoice_record.due_date,
            'payment_method', invoice_record.payment_method,
            'payment_date', invoice_record.payment_date,
            'payment_instructions', invoice_record.payment_instructions,
            'shared_url', invoice_record.shared_url,
            'created_at', invoice_record.created_at,
            'updated_at', invoice_record.updated_at,
            'client_name', invoice_record.client_name,
            'client_website', invoice_record.client_website,
            'client_address', invoice_record.client_address,
            'client_tax_id', invoice_record.client_tax_id,
            'billing_name', invoice_record.billing_name,
            'billing_tax_id', invoice_record.billing_tax_id,
            'billing_address', invoice_record.billing_address,
            'billing_email', invoice_record.billing_email,
            'includes_vat', invoice_record.includes_vat,
            'invoice_number', invoice_record.invoice_number
        );
    ELSE
        -- No invoice found with that shared URL
        RETURN;
    END IF;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;
