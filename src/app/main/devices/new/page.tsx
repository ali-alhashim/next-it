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

export default function AddDevicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    serialNumber: '',
    category: '',
    model: '',
    
    
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

 

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('serialNumber', form.serialNumber);
    formData.append('category', form.category);
    formData.append('model', form.model);
   
    
   

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

      

    

    

     

      <PrimaryButton text="Add Device" onClick={handleSubmit} />
    </Stack>
  );
}
