'use client';

import { useEffect, useState, useMemo } from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Image, ImageFit } from '@fluentui/react/lib/Image';
import { useRouter } from 'next/navigation';

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

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
      setTotalUsers(data.total);
    };
    fetchUsers();
  }, [page]);

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
        <Image src={`/api/${item.photo}`} width={40} height={40} imageFit={ImageFit.cover} styles={{ root: { borderRadius: '50%' } }} />
      ),
    },
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 120,
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
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32 } }}>
      <Stack horizontal horizontalAlign="space-between">
        <Text variant="xxLarge">Users</Text>
        <PrimaryButton text="Add New User" onClick={() => router.push('/main/users/new')} />
      </Stack>

      <TextField
        placeholder="Search by name, email or badge number..."
        value={search}
        onChange={(_, val) => setSearch(val || '')}
      />

      <DetailsList
        items={filtered}
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
