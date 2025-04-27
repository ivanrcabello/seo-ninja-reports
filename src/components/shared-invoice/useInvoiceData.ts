
import { useState, useEffect } from 'react';
import { SharedInvoice } from './types';

export const useInvoiceData = (invoice: SharedInvoice) => {
  const [subtotal, setSubtotal] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    if (invoice) {
      // Si el precio incluye IVA, calculamos el subtotal y el IVA
      if (invoice.includes_vat !== false) {
        const subtotalAmount = invoice.amount / 1.21;
        const ivaAmount = invoice.amount - subtotalAmount;
        
        setSubtotal(subtotalAmount);
        setIva(ivaAmount);
        setTotal(invoice.amount);
      } else {
        // Si no incluye IVA, el subtotal es el mismo que el total
        setSubtotal(invoice.amount);
        setIva(0);
        setTotal(invoice.amount);
      }
    }
  }, [invoice]);
  
  return {
    subtotal,
    iva,
    total,
    formatCurrency: (amount: number) => {
      return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(amount);
    },
    includesVat: invoice.includes_vat !== false
  };
};
