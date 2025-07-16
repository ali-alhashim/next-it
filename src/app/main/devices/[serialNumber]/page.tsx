'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Text,
  Spinner,
  MessageBar,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  
  Button,
  Card,
  CardHeader,
  CardFooter,
  DialogContent,
} from '@fluentui/react-components';
import {
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  MessageBarType,
  Stack,
} from '@fluentui/react';

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

interface User {
  badgeNumber: string;
  name: string;
}

const DeviceDetail = () => {
  const { serialNumber } = useParams();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [receivedDate, setReceivedDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdAtString, setCreatedAtString] = useState('');

  // Fetch device
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(`/api/devices/${serialNumber}`);
        if (!res.ok) throw new Error('Device not found');
        const data = await res.json();
        setDevice(data);

        if (data?.createdAt?.$date) {
          const formatted = new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC',
          }).format(new Date(data.createdAt.$date));
          setCreatedAtString(formatted);
        }
      } catch (error) {
        console.error('Error fetching device:', error);
        setDevice(null);
      } finally {
        setLoading(false);
      }
    };

    if (serialNumber) fetchDevice();
  }, [serialNumber]);

  // Fetch users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users',  { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
         setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser || !receivedDate) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/devices/${serialNumber}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badgeNumber: selectedUser.badgeNumber,
          receivedDate,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setDevice(updated);
        setSelectedUser(null);
        setReceivedDate('');
      } else {
        console.error('Error submitting data');
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

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
          <Text><strong>Created At:</strong> {createdAtString}</Text>
        </Stack>
        <CardFooter>
          <Text variant="mediumPlus">Total Users: {device.users.length}</Text>
        </CardFooter>
      </Card>

    
   
      <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            exercitationem cumque repellendus eaque est dolor eius expedita
            nulla ullam? Tenetur reprehenderit aut voluptatum impedit voluptates
            in natus iure cumque eaque?
          </DialogContent>
          <DialogActions>
            <Button appearance="primary">Do Something</Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>


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
