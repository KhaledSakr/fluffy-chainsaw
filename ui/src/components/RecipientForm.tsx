import React from 'react';
import { RecipientProfile } from '../types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface RecipientFormProps {
  recipient: Partial<RecipientProfile>; // Allow partial for new recipients
  onSave: (recipient: RecipientProfile) => void;
  onCancel: () => void;
}

const RecipientForm: React.FC<RecipientFormProps> = ({ recipient, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Partial<RecipientProfile>>(recipient);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation if needed
    onSave(formData as RecipientProfile); // Assume validation passes or handle appropriately
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{recipient.id ? 'Edit Recipient' : 'Add New Recipient'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Recipient Name</Label>
            <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Recipient Full Name" required />
          </div>
          <div>
            <Label htmlFor="address">Recipient Address</Label>
            <Input id="address" name="address" value={formData.address || ''} onChange={handleInputChange} placeholder="Street Address, City, ZIP" required />
          </div>
          <div>
            <Label htmlFor="email">Recipient Email</Label>
            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} placeholder="recipient@example.com" />
          </div>
          <div>
            <Label htmlFor="telephone">Recipient Telephone</Label>
            <Input id="telephone" name="telephone" value={formData.telephone || ''} onChange={handleInputChange} placeholder="+1234567890" />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Account Name</Label>
            <Input id="bankName" name="bankName" value={formData.bankName || ''} onChange={handleInputChange} placeholder="Account Holder Name (optional)" />
          </div>
          <div>
            <Label htmlFor="bank">Bank Name</Label>
            <Input id="bank" name="bank" value={formData.bank || ''} onChange={handleInputChange} placeholder="Bank Name (optional)" />
          </div>
          <div>
            <Label htmlFor="IBAN">IBAN</Label>
            <Input id="IBAN" name="IBAN" value={formData.IBAN || ''} onChange={handleInputChange} placeholder="IBAN (optional)" />
          </div>
          <div>
            <Label htmlFor="BIC">BIC</Label>
            <Input id="BIC" name="BIC" value={formData.BIC || ''} onChange={handleInputChange} placeholder="BIC/SWIFT (optional)" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Recipient</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RecipientForm;

