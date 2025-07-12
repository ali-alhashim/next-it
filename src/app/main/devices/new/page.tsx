'use client';
//src/app/main/devices/new/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Stack,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  Label,
} from '@fluentui/react';


const categoryOptions: IDropdownOption[] = [
  { key: 'Laptop', text: 'Laptop' },
  { key: 'Desktop PC', text: 'Desktop PC' },
  { key: 'Monitor', text: 'Monitor' },
  { key: 'Printer', text: 'Printer' },
  { key: 'Other', text: 'Other' },
  
  
];

const statusOptions:IDropdownOption[] = [
  {key:'New', text:'New'},
  {key:'Used', text:'Used'},
  {key:'Old', text:'Old'},
  {key:'Damaged', text:'Damaged'},
  { key: 'Lost', text: 'Lost' },
  { key: 'Stolen', text: 'Stolen' },
]

export default function AddDevicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    serialNumber: '',
    category: '',
    model: '',
    description:'',
    manufacture:'',
    invoiceNumber:'',
    supplier:'',
    status:'',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

 

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('serialNumber', form.serialNumber);
    formData.append('category', form.category);
    formData.append('model', form.model);
    formData.append('description', form.description);
    formData.append('manufacture', form.manufacture);
    formData.append('invoiceNumber', form.invoiceNumber);
    formData.append('supplier', form.supplier);
    formData.append('status', form.status);
   
    
   

    const res = await fetch('/api/devices/new', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (res.ok) {
      router.push('/main/devices');
    } else {
      alert('Failed to add device');
    }
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32, maxWidth: 600 } }}>
      <h2>Add New Device</h2>

      <TextField
        label="Serial Number"
        value={form.serialNumber}
        onChange={(_, v) => handleInputChange('serialNumber', v || '')}
        required
      />

        <Dropdown
        label="Category"
        selectedKey={form.category}
        onChange={(_, option) => handleInputChange('category', option?.key as string)}
        options={categoryOptions}
        required
      />

      <TextField
        label="Model"
        value={form.model}
        onChange={(_, v) => handleInputChange('model', v || '')}
        required
      />

        <TextField
        label="Description"
        value={form.description}
        onChange={(_, v) => handleInputChange('description', v || '')}
        required
      />
      
       <TextField
        label="Manufacture"
        value={form.manufacture}
        onChange={(_, v) => handleInputChange('manufacture', v || '')}
        required
      />

       <TextField
        label="Invoice Number"
        value={form.invoiceNumber}
        onChange={(_, v) => handleInputChange('invoiceNumber', v || '')}
        required
      />

      <TextField
        label="Supplier"
        value={form.supplier}
        onChange={(_, v) => handleInputChange('supplier', v || '')}
        required
      />

       <Dropdown
        label="Status"
        selectedKey={form.status}
        onChange={(_, option) => handleInputChange('status', option?.key as string)}
        options={statusOptions}
        required
      />
      

      

      

      

      

    

    

     

      <PrimaryButton text="Add Device" onClick={handleSubmit} />
    </Stack>
  );
}
