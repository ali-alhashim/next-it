'use client';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Separator } from '@fluentui/react/lib/Separator';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { useEffect, useState } from 'react';

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div
    style={{
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      minWidth: 300,
      flex: 1,
    }}
  >
    <Text variant="xLarge">{title}</Text>
    <Separator styles={{ root: { margin: '10px 0' } }} />
    <div>{children}</div>
  </div>
);

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; badgeNumber: string, photo:string, role:string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/users/me',  { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const assets = [
    { type: 'Laptop', model: 'Dell Latitude', receivedDate:'May-03-2025' , handoverDate:'' },
    { type: 'Monitor', model: 'HP 24"' , receivedDate:'July-06-2025', handoverDate:''},
    { type: 'Phone', model: 'iPhone 12' , receivedDate:'June-24-2024', handoverDate:'July-06-2025'},
  ];

  const tickets = [
    { id: '1234', subject: 'Laptop not working', status:'OPEN' },
    { id: '1235', subject: 'Request new email', status:'CLOSED' },
  ];



  const assetColumns: IColumn[] = [
    { key: '1', name: 'Type', fieldName: 'type', minWidth: 100 },
    { key: '2', name: 'Model', fieldName: 'model', minWidth: 200 },
    { key: '3', name: 'Received Date', fieldName: 'receivedDate', minWidth: 200 },
    { key: '4', name: 'Handover Date', fieldName: 'handoverDate', minWidth: 200 },
  ];

  const ticketColumns: IColumn[] = [
    { key: '1', name: 'Ticket ID', fieldName: 'id', minWidth: 100 },
    { key: '2', name: 'Subject', fieldName: 'subject', minWidth: 200 },
    { key: '3', name: 'Status', fieldName: 'status', minWidth: 200 },
  ];



  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{ root: { padding: 32, minHeight: '100vh' } }}
    >
      <Text variant="xxLarge" styles={{ root: { marginBottom: 16 } }}>
        Welcome to Next-IT Dashboard
      </Text>

      <Stack tokens={{ childrenGap: 20 }} wrap>
       

       <Card title="User Information">
  <Stack horizontal tokens={{ childrenGap: 20 }} verticalAlign="center">
    <img
      src={`/api/${user?.photo || 'uploads/default.png'}`}
      width={100}
      height={100}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
      alt="User Photo"
    />

    <Stack tokens={{ childrenGap: 4 }}>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        {user?.name ?? 'Loading...'}
      </Text>

      <Text variant="smallPlus" styles={{ root: { color: '#666' } }}>
        Badge: {user?.badgeNumber ?? 'Loading...'}
      </Text>

      <Text variant="smallPlus" styles={{ root: { color: '#666' } }}>
        Email: {user?.email ?? 'Loading...'}
      </Text>

      {user?.role && (
        <Text variant="smallPlus" styles={{ root: { color: '#666' } }}>
          Role: {user.role}
        </Text>
      )}
    </Stack>
  </Stack>
</Card>


        <Card title="My IT Assets">
          <DetailsList items={assets} columns={assetColumns} />
        </Card>

        <Card title="My Tickets">
          <DetailsList items={tickets} columns={ticketColumns} />
        </Card>
      </Stack>
    </Stack>
  );
}
