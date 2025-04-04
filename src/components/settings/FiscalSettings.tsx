
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePersistentState } from '@/hooks/usePersistentState';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const FiscalSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('España');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [vatRate, setVatRate] = usePersistentState<number>('vatRate', 21);

  // Load fiscal settings from database
  useEffect(() => {
    const loadFiscalSettings = async () => {
      setIsLoading(true);
      try {
        // Load fiscal settings
        const { data: fiscalData, error: fiscalError } = await supabase
          .from('fiscal_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (fiscalError && fiscalError.code !== 'PGRST116') { // No rows returned
          throw fiscalError;
        }

        if (fiscalData) {
          setCompanyName(fiscalData.company_name || '');
          setTaxId(fiscalData.tax_id || '');
          setAddress(fiscalData.address || '');
          setPostalCode(fiscalData.postal_code || '');
          setCity(fiscalData.city || '');
          setProvince(fiscalData.province || '');
          setCountry(fiscalData.country || 'España');
          setPhone(fiscalData.phone || '');
          setEmail(fiscalData.email || '');
          setWebsite(fiscalData.website || '');
        }

        // Load VAT rate from settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('vat_rate')
          .eq('id', 1)
          .single();

        if (settingsError) {
          throw settingsError;
        }

        if (settingsData && settingsData.vat_rate) {
          setVatRate(Number(settingsData.vat_rate));
        }
      } catch (error) {
        console.error('Error loading fiscal settings:', error);
        toast.error('Error al cargar la configuración fiscal');
      } finally {
        setIsLoading(false);
      }
    };

    loadFiscalSettings();
  }, [setVatRate]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Save fiscal settings
      const { error: fiscalError } = await supabase
        .from('fiscal_settings')
        .upsert({
          id: 1,
          company_name: companyName,
          tax_id: taxId,
          address,
          postal_code: postalCode,
          city,
          province,
          country,
          phone,
          email,
          website,
          updated_at: new Date().toISOString()
        });

      if (fiscalError) throw fiscalError;

      // Save VAT rate to settings
      const { error: settingsError } = await supabase
        .from('settings')
        .update({ vat_rate: vatRate })
        .eq('id', 1);

      if (settingsError) throw settingsError;

      toast.success('Configuración fiscal guardada correctamente');
    } catch (error) {
      console.error('Error saving fiscal settings:', error);
      toast.error('Error al guardar la configuración fiscal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Fiscal</CardTitle>
        <CardDescription>
          Configura la información fiscal de tu empresa que aparecerá en las facturas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nombre de la Empresa</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Tu Empresa S.L."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tax-id">CIF/NIF</Label>
            <Input
              id="tax-id"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="B12345678"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle Principal, 123"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postal-code">Código Postal</Label>
            <Input
              id="postal-code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="28001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Madrid"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="province">Provincia</Label>
            <Input
              id="province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Madrid"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="España"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 600 000 000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contacto@tuempresa.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website">Sitio Web</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="www.tuempresa.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vat-rate">Tipo de IVA (%)</Label>
            <Input
              id="vat-rate"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={vatRate}
              onChange={(e) => setVatRate(Number(e.target.value))}
              placeholder="21"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? 'Guardando...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Información Fiscal
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FiscalSettings;
