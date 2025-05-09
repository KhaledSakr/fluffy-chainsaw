export interface CompanyProfile {
  companyName: string;
  companyAddress: string;
  companyVat: string;
  companyRegNo: string;
  companyBankName: string;
  companyBankIban: string;
  companyBankSwift: string;
  companyShortName?: string; // Used for directory naming in backend
}

export interface InvoiceItem {
  id: string; // Added for frontend key management
  description: string;
  amount: number;
  rate?: number;
  additional?: number;
  fromOverride?: string; // Optional date override
  toOverride?: string; // Optional date override
  execlude?: boolean; // Typo from backend, keeping for consistency
}

export interface RecipientProfile {
  id: string; // Added for frontend key management
  name: string;
  address: string;
  vat: string;
  regNo: string;
  bankName?: string; // Optional, defaults to name
  bankIban: string;
  bankSwift: string;
  invoiceOverride?: string; // Optional invoice index override
  items: InvoiceItem[];
  skip?: boolean; // Optional flag to skip generation
}

// Interface for the data structure expected by the backend template
export interface InvoiceTemplateData extends CompanyProfile, Omit<RecipientProfile, 'id' | 'items'> {
  invoiceNo: string;
  items: Array<InvoiceItem & { amount: string; from: string; to: string }>; // Processed items
  total: string; // Processed total
  date: string; // Generation date
}

// Added Invoice interface for frontend state management
export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string; // ISO string date
  company: CompanyProfile;
  recipient: RecipientProfile;
  items: InvoiceItem[];
}

