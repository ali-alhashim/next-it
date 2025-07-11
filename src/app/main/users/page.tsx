'use client';
//src/app/main/users/page.tsx
import { useEffect, useState, useMemo } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { useRouter } from 'next/navigation';
import { Button, Display } from '@fluentui/react-components';
import {
 
  ArrowUploadFilled,
  ArrowDown12Filled,
  PersonPasskeyRegular
} from "@fluentui/react-icons";

interface User {
  id: string;
  name: string;
  email: string;
  badgeNumber: string;
  role: string;
  photo: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(totalUsers / pageSize);


  function handelResetPassword(badgeNumber:String)
  {
    //show prompt to get password value
    // send post request to /api/users/reset-password/[badgeNumber]
    // with the password

     const newPassword = window.prompt(`Enter a new password for user ${badgeNumber}:`);
     if (!newPassword) return;

     fetch(`/api/users/reset-password/${badgeNumber}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ password: newPassword }),
  })
    .then(res => {
      if (res.ok) {
        alert('Password reset successfully.');
      } else {
        alert('Failed to reset password.');
      }
    })
    .catch(() => {
      alert('An error occurred while resetting the password.');
    });
    
  }


  const fetchUsers = async () => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search: search,
    sortField: sortField || '',
    sortOrder: sortAsc ? 'asc' : 'desc'
  });

  const res = await fetch(`/api/users?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const data = await res.json();
  setUsers(data.users);
  setTotalUsers(data.total);
};

  // Fetch users from API
  useEffect(() => {
  fetchUsers();
}, [page, search, sortField, sortAsc]);

  // Filter and sort locally (optional)
  const filtered = useMemo(() => {
    let result = users;

    if (search) {
      result = result.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.badgeNumber.includes(search)
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField as keyof User];
        const valB = b[sortField as keyof User];
        return (valA > valB ? 1 : -1) * (sortAsc ? 1 : -1);
      });
    }

    return result;
  }, [users, search, sortField, sortAsc]);

  const columns: IColumn[] = [
    {
      key: 'img',
      name: 'Image',
      fieldName: 'image',
      minWidth: 50,
      maxWidth: 60,
      onRender: (item: User) => (
        <Image src={`/api/${item.photo || 'uploads/default.png'}`} width={40} height={40} imageFit={ImageFit.cover} styles={{ root: { borderRadius: '50%' } }} />
      ),
    },
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('name'),
    },
    {
      key: 'badgeNumber',
      name: 'Badge Number',
      fieldName: 'badgeNumber',
      minWidth: 150,
      isResizable: true,
      onRender: (item: User) => (
        <a style={{ color: '#0078d4', cursor: 'pointer' }} onClick={() => router.push(`/main/users/${item.badgeNumber}`)}>
          {item.badgeNumber}
        </a>
      ),
      onColumnClick: () => handleSort('badgeNumber'),
    },
    {
      key: 'email',
      name: 'Email',
      fieldName: 'email',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('email'),
    },
    {
      key: 'role',
      name: 'Role',
      fieldName: 'role',
      minWidth: 100,
      isResizable: true,
      onColumnClick: () => handleSort('role'),
    },
    {
      key: 'resetPassword',
      name: 'Reset Password',
      fieldName: 'resetPassword',
      minWidth: 100,
      isResizable: true,
      onRender: (item: User) => (
        <a style={{ color: '#0078d4', cursor: 'pointer' }} onClick={() => handelResetPassword(item.badgeNumber)}>
          <PersonPasskeyRegular style={{ fontSize: 20 }} />
        </a>
      )
    },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

   // export all users as csv file without password field & photo 
  async function handelExport() {
  try {
    const res = await fetch(`/api/users?page=0&pageSize=10000`, {
      credentials: 'include',
    });

    if (!res.ok) {
      alert('Failed to fetch users for export');
      return;
    }

    const data = await res.json();
    const allUsers = data.users;

    if (!allUsers.length) {
      alert('No users to export');
      return;
    }

    // Desired column headers
    const headers = ['Name', 'Badge Number', 'Email', 'Role'];

    // Map rows in correct column order
    const rows = allUsers.map((user: any) => [
      user.name,
      user.badgeNumber,
      user.email,
      user.role,
    ]);

    // Generate CSV string
    const csvContent = [
      headers.join(','), // Header row
      ...rows.map((row: string[]) =>
        row.map((field) => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed');
  }
}


    // we will use hidden input type file open except only CSV get the file  send to api/users/import
    function handelImport()
   {
      const csvFile = document.getElementById('csvFileId');
      csvFile?.click();
   }


   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('csv', file);

    fetch('/api/users/import', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((res) => {
    if (res.ok) {
      alert('Users imported successfully');
      //reload user list
      fetchUsers();
      
    } else {
      alert('Import failed');
    }
  });
}

  return (
    
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32 } }}>
      <input type="file" id="csvFileId" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
      <Stack horizontal horizontalAlign="space-between">
        <Text variant="xxLarge">Users</Text>

        <Button icon={<ArrowUploadFilled />} text="Import Users" onClick={() => handelImport()} > Import Users</Button>
         

         <Button icon={<ArrowDown12Filled />} text="Export Users" onClick={() => handelExport()} > Export Users</Button>

        <PrimaryButton text="Add New User" onClick={() => router.push('/main/users/new')} />
      </Stack>

      <TextField
        placeholder="Search by name, email or badge number..."
        value={search}
        onChange={(_, val) => setSearch(val || '')}
      />

      <DetailsList
        items={users}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        styles={{ root: { marginTop: 10 } }}
        />

      <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
        <DefaultButton
          text="Prev"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        />
        <Text>{page + 1} / {totalPages}</Text>
        <DefaultButton
          text="Next"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </Stack>
    </Stack>
  );
}
