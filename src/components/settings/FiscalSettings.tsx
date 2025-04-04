
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useFiscalSettings } from '@/hooks/useFiscalSettings';

const FiscalSettings = () => {
  const { fiscalSettings, isLoading, saveFiscalSettings } = useFiscalSettings();
  
  const [companyName, setCompanyName] = useState(fiscalSettings?.company_name || '');
  const [taxId, setTaxId] = useState(fiscalSettings?.tax_id || '');
  const [address, setAddress] = useState(fiscalSettings?.address || '');
  const [postalCode, setPostalCode] = useState(fiscalSettings?.postal_code || '');
  const [city, setCity] = useState(fiscalSettings?.city || '');
  const [province, setProvince] = useState(fiscalSettings?.province || '');
  const [country, setCountry] = useState(fiscalSettings?.country || 'España');
  const [phone, setPhone] = useState(fiscalSettings?.phone || '');
  const [email, setEmail] = useState(fiscalSettings?.email || '');
  const [website, setWebsite] = useState(fiscalSettings?.website || '');
  const [vatRate, setVatRate] = useState<number>(fiscalSettings?.vat_rate || 21);

  // Update form values when fiscal settings are loaded
  React.useEffect(() => {
    if (fiscalSettings) {
      setCompanyName(fiscalSettings.company_name || '');
      setTaxId(fiscalSettings.tax_id || '');
      setAddress(fiscalSettings.address || '');
      setPostalCode(fiscalSettings.postal_code || '');
      setCity(fiscalSettings.city || '');
      setProvince(fiscalSettings.province || '');
      setCountry(fiscalSettings.country || 'España');
      setPhone(fiscalSettings.phone || '');
      setEmail(fiscalSettings.email || '');
      setWebsite(fiscalSettings.website || '');
      setVatRate(fiscalSettings.vat_rate || 21);
    }
  }, [fiscalSettings]);

  const handleSaveSettings = async () => {
    await saveFiscalSettings({
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
      vat_rate: vatRate
    });
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
