import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceItem } from '../types/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  setItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
}

const InvoiceItemsComponent: React.FC<InvoiceItemsProps> = ({ items, setItems }) => {

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), description: '', amount: 0 }]);
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number | boolean) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Invoice Items</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="w-[100px]">Rate</TableHead>
            <TableHead className="w-[100px]">Additional</TableHead>
            <TableHead className="w-[100px]">From Date</TableHead>
            <TableHead className="w-[100px]">To Date</TableHead>
            <TableHead className="w-[50px]">Hide Dates</TableHead>
            <TableHead className="w-[50px]">Exclude</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Service description"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.rate || ''}
                  onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || undefined)}
                  placeholder="1.0"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.additional || ''}
                  onChange={(e) => handleItemChange(item.id, 'additional', parseFloat(e.target.value) || undefined)}
                  placeholder="0.00"
                />
              </TableCell>
              <TableCell>
                 <Input
                  value={item.fromOverride || ''}
                  onChange={(e) => handleItemChange(item.id, 'fromOverride', e.target.value || undefined)}
                  placeholder="Default: 1st of month"
                />
              </TableCell>
               <TableCell>
                 <Input
                  value={item.toOverride || ''}
                  onChange={(e) => handleItemChange(item.id, 'toOverride', e.target.value || undefined)}
                  placeholder="Default: End of month"
                />
              </TableCell>
              <TableCell className="text-center">
                <Checkbox
                  checked={item.hideFromTo}
                  onCheckedChange={(checked) => handleItemChange(item.id, 'hideFromTo', !!checked)}
                />
              </TableCell>
               <TableCell className="text-center">
                <Checkbox
                  checked={item.exclude}
                  onCheckedChange={(checked) => handleItemChange(item.id, 'exclude', !!checked)}
                />
              </TableCell>
              <TableCell>
                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleAddItem} variant="outline">Add Item</Button>
    </div>
  );
};

export default InvoiceItemsComponent;

