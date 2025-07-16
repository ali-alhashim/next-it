'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Text,

  Spinner,
  MessageBar,
 
  Card,
  CardHeader,
  CardFooter,
  Button,
} from '@fluentui/react-components';
import { DetailsList, DetailsListLayoutMode, IColumn, MessageBarType, Stack } from '@fluentui/react';

interface DeviceUser {
  badgeNumber: string;
  receivedDate: string;
  handoverDate: string;
  note: string;
  createdAt: { $date: string };
}

interface Device {
  serialNumber: string;
  category: string;
  model: string;
  description: string;
  manufacture: string;
  status: string;
  createdAt: { $date: string };
  users: DeviceUser[];
}

const DeviceDetail = () => {
  const { serialNumber } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(`/api/devices/${serialNumber}`);
        if (!res.ok) throw new Error('Device not found');
        const data = await res.json();
        setDevice(data);
      } catch (error) {
        console.error('Error fetching device:', error);
        setDevice(null);
      } finally {
        setLoading(false);
      }
    };

    if (serialNumber) {
      fetchDevice();
    }
  }, [serialNumber]);

  const userColumns: IColumn[] = [
    { key: 'badgeNumber', name: 'Badge Number', fieldName: 'badgeNumber', minWidth: 100 },
    { key: 'receivedDate', name: 'Received Date', fieldName: 'receivedDate', minWidth: 130 },
    { key: 'handoverDate', name: 'Handover Date', fieldName: 'handoverDate', minWidth: 130 },
    { key: 'note', name: 'Note', fieldName: 'note', minWidth: 200 },
    {
      key: 'createdAt',
      name: 'Created At',
      fieldName: 'createdAt',
      minWidth: 150,
      onRender: (item: DeviceUser) =>
      item.createdAt?.$date,
    },
  ];

  if (loading) return <Spinner label="Loading device data..." />;

  if (!device) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        Device not found
      </MessageBar>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 24 } }}>
      <Card>
        <CardHeader>
          <Text variant="xLargePlus">Device Details</Text>
        </CardHeader>
        <Stack tokens={{ childrenGap: 8 }} styles={{ root: { padding: 16 } }}>
          <Text><strong>Serial Number:</strong> {device.serialNumber}</Text>
          <Text><strong>Category:</strong> {device.category}</Text>
          <Text><strong>Model:</strong> {device.model}</Text>
          <Text><strong>Description:</strong> {device.description}</Text>
          <Text><strong>Manufacture:</strong> {device.manufacture}</Text>
          <Text><strong>Status:</strong> {device.status}</Text>
          <Text><strong>Created At:</strong> {new Date(device.createdAt?.$date).toLocaleString('en-GB')}</Text>
        </Stack>
        <CardFooter>
          <Text variant="mediumPlus">Total Users: {device.users.length}</Text>
        </CardFooter>
      </Card>

      <Button>Add Device User</Button>

      <Card>
        <CardHeader>
          <Text variant="xLarge">Users History</Text>
        </CardHeader>
        <div style={{ padding: 16 }}>
          <DetailsList
            items={device.users}
            columns={userColumns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionPreservedOnEmptyClick
            styles={{ root: { overflowX: 'auto' } }}
          />
        </div>
      </Card>
    </Stack>
  );
};

export default DeviceDetail;
