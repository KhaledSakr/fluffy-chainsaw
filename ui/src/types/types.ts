export interface CompanyProfile {
  name: string;
  address: string;
  email?: string;
  telephone?: string;
  companyLongName: string;
  companyAddressLine1: string;
  companyAddressLine2: string;
  companyCountry: string;
  companyShortName: string; // Used for directory structure
}

export interface RecipientProfile {
  id: string; // Unique identifier
  name: string;
  address: string;
  email?: string;
  telephone?: string;
  bankName?: string;
  bank?: string;
  IBAN?: string;
  BIC?: string;
}

export interface InvoiceItem {
  id: string; // Unique identifier
  description: string;
  amount: number;
  rate?: number; // Optional rate
  additional?: number; // Optional additional amount
  fromOverride?: string; // Optional date override
  toOverride?: string; // Optional date override
  hideFromTo?: boolean;
  exclude?: boolean; // Exclude from total calculation
}

export interface InvoiceData {
  recipientId: string; // Link to RecipientProfile
  items: InvoiceItem[];
  invoiceOverride?: string; // Optional invoice number override part
}

