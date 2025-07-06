'use client';

import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { Separator } from '@fluentui/react/lib/Separator';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';

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


  const user = {
    name: 'Ali Alhashim',
    email: 'Ali-Alhashim@outlook.com',
    badgeNumber: '954',
  };

  const assets = [
    { type: 'Laptop', model: 'Dell Latitude', receivedDate:'May-03-2025' , handoverDate:'' },
    { type: 'Monitor', model: 'HP 24"' ,      receivedDate:'July-06-2025', handoverDate:''},
    { type: 'Phone', model: 'iPhone 12' ,     receivedDate:'June-24-2024', handoverDate:'July-06-2025'},
  ];

  const tickets = [
    { id: '1234', subject: 'Laptop not working', status:'OPEN' },
    { id: '1235', subject: 'Request new email', status:'CLOSED' },
  ];

  const userColumns: IColumn[] = [
    { key: '1', name: 'Field', fieldName: 'field', minWidth: 100, isResizable: true },
    { key: '2', name: 'Value', fieldName: 'value', minWidth: 200, isResizable: true },
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

  const userItems = [
    { field: 'Name', value: user.name },
    { field: 'Email', value: user.email },
    { field: 'Badge Number', value: user.badgeNumber },
  ];

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{ root: { padding: 32,  minHeight: '100vh' } }}
    >
      <Text variant="xxLarge" styles={{ root: { marginBottom: 16 } }}>
        Welcome to Next-IT Dashboard
      </Text>

      <Stack  tokens={{ childrenGap: 20 }} wrap>
        {/* Card 1: User Info */}
        <Card title="User Information">
          <DetailsList items={userItems} columns={userColumns} />
        </Card>

        {/* Card 2: My IT Assets */}
        <Card title="My IT Assets">
          <DetailsList items={assets} columns={assetColumns} />
        </Card>

        {/* Card 3: My Tickets */}
        <Card title="My Tickets">
          <DetailsList items={tickets} columns={ticketColumns} />
        </Card>
      </Stack>
    </Stack>
  );
}
