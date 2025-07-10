'use client';
//src/app/main/users/new/page.tsx
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
import { Image, ImageFit } from '@fluentui/react/lib/Image';

const roleOptions: IDropdownOption[] = [
  { key: 'Admin', text: 'Admin' },
  { key: 'IT', text: 'IT' },
  { key: 'User', text: 'User' },
];

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    badgeNumber: '',
    email: '',
    role: '',
    password: '',
    photo: null as File | null,
    photoPreview: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('badgeNumber', form.badgeNumber);
    formData.append('email', form.email);
    formData.append('role', form.role);
    formData.append('password', form.password);
    if (form.photo) formData.append('photo', form.photo);

    const res = await fetch('/api/users/new', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (res.ok) {
      router.push('/main/users');
    } else {
      alert('Failed to add user');
    }
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32, maxWidth: 600 } }}>
      <h2>Add New User</h2>

      <TextField
        label="Name"
        value={form.name}
        onChange={(_, v) => handleInputChange('name', v || '')}
        required
      />

      <TextField
        label="Badge Number"
        value={form.badgeNumber}
        onChange={(_, v) => handleInputChange('badgeNumber', v || '')}
        required
      />

      <TextField
        label="Email"
        value={form.email}
        onChange={(_, v) => handleInputChange('email', v || '')}
        required
      />

      <Dropdown
        label="Role"
        selectedKey={form.role}
        onChange={(_, option) => handleInputChange('role', option?.key as string)}
        options={roleOptions}
        required
      />

      <TextField
        label="Password"
        type="password"
        canRevealPassword
        value={form.password}
        onChange={(_, v) => handleInputChange('password', v || '')}
        required
      />

      <Label>Photo</Label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {form.photoPreview && (
        <Image
          src={form.photoPreview}
          width={80}
          height={80}
          imageFit={ImageFit.cover}
          styles={{ root: { borderRadius: '50%', marginTop: 10 } }}
        />
      )}

      <PrimaryButton text="Add User" onClick={handleSubmit} />
    </Stack>
  );
}
