
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FiscalSettings } from '@/components/shared-invoice/types';
import { toast } from 'sonner';

export const useFiscalSettings = () => {
  const [fiscalSettings, setFiscalSettings] = useState<FiscalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchFiscalSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try with custom function
      const { data: vatRateData, error: vatRateError } = await supabase
        .rpc('get_vat_rate_wrapper');
        
      // Note: fiscal_settings table needs to be manually added to the Database type
      // to avoid TypeScript errors, but the query will still work
      const { data: fiscalData, error: fiscalError } = await supabase
        .from('fiscal_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (fiscalError && fiscalError.message !== 'No rows found') {
        throw fiscalError;
      }
      
      // Combine the data
      let vatRate = 21; // Default
      if (vatRateError) {
        console.warn('Error loading VAT rate:', vatRateError);
        
        // Fallback to direct query
        const { data: settingsData } = await supabase
          .from('settings')
          .select('vat_rate')
          .eq('id', 1)
          .single();
        
        if (settingsData && typeof settingsData.vat_rate === 'number') {
          vatRate = settingsData.vat_rate;
        }
      } else if (vatRateData !== null) {
        vatRate = Number(vatRateData);
      }
      
      // Construct the settings object
      if (fiscalData) {
        setFiscalSettings({
          ...fiscalData as FiscalSettings,
          vat_rate: vatRate
        });
      } else {
        // Create empty settings with default values
        setFiscalSettings({
          id: 1,
          company_name: '',
          tax_id: '',
          address: '',
          postal_code: '',
          city: '',
          province: '',
          country: 'España',
          phone: '',
          email: '',
          website: '',
          vat_rate: vatRate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Error fetching fiscal settings:', err);
      setError(err.message || 'Error loading fiscal settings');
      toast.error('Error loading fiscal settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveFiscalSettings = async (settings: Partial<FiscalSettings>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const settingsToSave = { ...settings };
      const vatRate = settingsToSave.vat_rate;
      
      // Remove vat_rate before saving to fiscal_settings as it's not in that table
      delete settingsToSave.vat_rate;
      
      // Save fiscal settings data
      const { error: fiscalError } = await supabase
        .from('fiscal_settings')
        .upsert({
          id: 1,
          ...settingsToSave,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (fiscalError) throw fiscalError;

      // Save VAT rate if included
      if (vatRate !== undefined) {
        try {
          const { error: rpcError } = await supabase
            .rpc('update_vat_rate_wrapper', { new_rate: vatRate });
          
          if (rpcError) {
            console.warn('RPC error when updating VAT rate:', rpcError);
            
            // Fallback - direct update
            const { error: directError } = await supabase
              .from('settings')
              .update({ vat_rate: vatRate })
              .eq('id', 1);
              
            if (directError) throw directError;
          }
        } catch (error) {
          console.error('Error saving VAT rate:', error);
          throw error;
        }
      }

      toast.success('Fiscal settings saved successfully');
      await fetchFiscalSettings(); // Refresh data
      return true;
    } catch (err: any) {
      console.error('Error saving fiscal settings:', err);
      setError(err.message || 'Error saving fiscal settings');
      toast.error('Error saving fiscal settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiscalSettings();
  }, []);

  return {
    fiscalSettings,
    isLoading,
    error,
    fetchFiscalSettings,
    saveFiscalSettings,
  };
};
