import React, { useState, useEffect } from 'react';
import { CompanyProfile, RecipientProfile, InvoiceItem, InvoiceData } from '../types/types';
import CompanyProfileComponent from './CompanyProfile';
import RecipientProfilesComponent from './RecipientProfiles';
import InvoiceItemsComponent from './InvoiceItems';
import InvoicePreviewComponent from './InvoicePreview';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const COMPANY_PROFILE_KEY = 'companyProfile';
const RECIPIENT_PROFILES_KEY = 'recipientProfiles';

const InvoiceGenerator: React.FC = () => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [recipientProfiles, setRecipientProfiles] = useState<RecipientProfile[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [invoiceOverride, setInvoiceOverride] = useState<string>(''); // For optional invoice number part
  const [showRecipientManager, setShowRecipientManager] = useState(false);

  useEffect(() => {
    // Load company profile
    const savedCompanyProfile = localStorage.getItem(COMPANY_PROFILE_KEY);
    if (savedCompanyProfile) {
      setCompanyProfile(JSON.parse(savedCompanyProfile));
    }

    // Load recipient profiles
    const savedRecipientProfiles = localStorage.getItem(RECIPIENT_PROFILES_KEY);
    if (savedRecipientProfiles) {
      setRecipientProfiles(JSON.parse(savedRecipientProfiles));
    }
  }, []);

  const selectedRecipient = recipientProfiles.find(p => p.id === selectedRecipientId) || null;

  const handleGenerateInvoice = () => {
    if (!companyProfile || !selectedRecipient || invoiceItems.length === 0) {
      alert('Please ensure company profile is set, a recipient is selected, and there are invoice items.');
      return;
    }

    const invoiceData: InvoiceData = {
      recipientId: selectedRecipient.id,
      items: invoiceItems,
      invoiceOverride: invoiceOverride || undefined,
    };

    const fullDataForBackend = {
        companyData: companyProfile,
        invoiceData: invoiceData,
        recipientData: selectedRecipient // Send selected recipient details
    }

    console.log('Generating Invoice with data:', JSON.stringify(fullDataForBackend, null, 2));
    // TODO: Replace console.log with actual API call to the Node.js backend
    // Example: fetch('/api/generate-invoice', { method: 'POST', body: JSON.stringify(fullDataForBackend), headers: {'Content-Type': 'application/json'} })
    alert('Invoice generation triggered! Check console for data. (Backend integration needed)');

    // Optionally clear items after generation
    // setInvoiceItems([]);
    // setSelectedRecipientId(null);
  };

  // Reload recipients when returning from manager
  useEffect(() => {
    if (!showRecipientManager) {
        const savedRecipientProfiles = localStorage.getItem(RECIPIENT_PROFILES_KEY);
        if (savedRecipientProfiles) {
          setRecipientProfiles(JSON.parse(savedRecipientProfiles));
        }
    }
  }, [showRecipientManager]);

  if (showRecipientManager) {
      return (
          <div className="p-4 md:p-8">
              <Button onClick={() => setShowRecipientManager(false)} className="mb-4">Back to Invoice</Button>
              <RecipientProfilesComponent />
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Invoice Generator</h1>

      {/* Section 1: Company Profile */}
      <CompanyProfileComponent />

      {/* Section 2: Recipient Selection & Management */}
      <Card>
        <CardHeader>
          <CardTitle>Recipient</CardTitle>
          <CardDescription>Select the recipient for this invoice.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow w-full md:w-auto">
            <Label htmlFor="recipient-select">Select Recipient</Label>
            <Select onValueChange={setSelectedRecipientId} value={selectedRecipientId || ''}>
              <SelectTrigger id="recipient-select">
                <SelectValue placeholder="Select a recipient" />
              </SelectTrigger>
              <SelectContent>
                {recipientProfiles.length > 0 ? (
                  recipientProfiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name} ({profile.address})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>No recipients available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowRecipientManager(true)} variant="outline">
            Manage Recipients
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: Invoice Items */}
      {selectedRecipientId && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <Label htmlFor="invoiceOverride">Invoice Number Suffix (Optional)</Label>
                <Input
                    id="invoiceOverride"
                    value={invoiceOverride}
                    onChange={(e) => setInvoiceOverride(e.target.value)}
                    placeholder="e.g., 001 (if different from default)"
                    className="max-w-xs"
                />
                <p className="text-xs text-gray-500 mt-1">Overrides the default sequential number for this month (e.g., YY-MM-XXX).</p>
            </div>
            <InvoiceItemsComponent items={invoiceItems} setItems={setInvoiceItems} />
          </CardContent>
        </Card>
      )}

      {/* Section 4: Preview */}
      {selectedRecipientId && invoiceItems.length > 0 && (
        <InvoicePreviewComponent
          companyProfile={companyProfile}
          recipientProfile={selectedRecipient}
          items={invoiceItems}
          invoiceNumber={invoiceOverride ? `${moment().format('YY-MM')}-${invoiceOverride}` : undefined}
        />
      )}

      {/* Section 5: Generate Button */}
      <div className="text-center mt-8">
        <Button
          size="lg"
          onClick={handleGenerateInvoice}
          disabled={!companyProfile || !selectedRecipientId || invoiceItems.length === 0}
        >
          Generate Invoice PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;

