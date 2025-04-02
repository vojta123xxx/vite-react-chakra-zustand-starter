import { useState } from 'react';

// Hook pro získání a uložení faktury
const useInvoiceRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const saveInvoice = async (invoiceData) => {
        setLoading(true);
        try {
            const response = await fetch('/api/save-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });

            if (!response.ok) {
                throw new Error('Chyba při ukládání faktury');
            }
            // Můžeš přidat další logiku pro úspěšné uložení
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { saveInvoice, loading, error };
};

export default useInvoiceRequest;
