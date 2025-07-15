'use client';

import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import {
  DetailsList,
  IColumn,
  SelectionMode,
  DetailsListLayoutMode,
} from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { DatePicker } from '@fluentui/react/lib/DatePicker';
import { useRouter } from 'next/navigation';

import { ArrowUploadFilled, ArrowDown12Filled } from "@fluentui/react-icons";
import { Button as FluentUIButton } from '@fluentui/react-components'; // Alias to avoid conflict
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import Link from 'next/link';

interface DeviceUserHistory {
  id: string;
  badgeNumber: string;
  receivedDate: string;
  handoverDate: string | null;
  note?: string;
}

interface Device {
  model: string;
  serialNumber: string;
  category: string;
  status: string;
  manufacture: string;
  description: string;
  supplier: string;
  invoiceNumber: string;
  users: DeviceUserHistory[];
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'Still Assigned';

  const isoStr = dateStr.replace(' ', 'T');
  const parsedDate = new Date(isoStr);

  return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toISOString().slice(0, 10);
};

export default function DevicesPage() {
  const router = useRouter();

  const [devices, setDevices] = useState<Device[]>([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDeviceSerial, setSelectedDeviceSerial] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('');
  const [handoverNote, setHandoverNote] = useState('');
  const [handoverDate, setHandoverDate] = useState<Date | undefined>(undefined);
  const [currentImportURL, setCurrentImportURL] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalDevices / pageSize));

  // Effect to set isClient to true once the component mounts on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define fetchDevices using useCallback to memoize it and prevent unnecessary re-creations
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: search,
      sortField: sortField || '',
      sortOrder: sortAsc ? 'asc' : 'desc'
    });

    try {
      const res = await fetch(`/api/devices?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) {
        console.error('Failed to fetch devices:', res.status, res.statusText);
        setDevices([]);
        setTotalDevices(0);
        return;
      }

      const data = await res.json();
      setDevices(data.devices);
      setTotalDevices(data.total);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
      setTotalDevices(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sortField, sortAsc]); // Dependencies for fetchDevices

  // Effect to trigger fetchDevices when dependencies change, and only if client-side
  useEffect(() => {
    if (!isClient) {
      return;
    }
    fetchDevices();
  }, [page, search, sortField, sortAsc, isClient, fetchDevices]); // Add fetchDevices to dependency array

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openDialog = (serial: string, badge: string) => {
    setSelectedDeviceSerial(serial);
    setSelectedBadge(badge);
    setHandoverNote('');
    setHandoverDate(undefined);
    setDialogVisible(true);
  };

  const handleSendHandoverRequest = async () => {
    if (!handoverDate) {
      alert('Please pick a handover date.');
      return;
    }

    try {
      const res = await fetch('/api/devices/send-handover-request', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: selectedDeviceSerial,
          badgeNumber: selectedBadge,
          handoverDate: handoverDate.toISOString(),
          note: handoverNote,
        }),
      });

      if (res.ok) {
        alert('Request sent successfully');
        setDialogVisible(false);
        fetchDevices(); // Re-fetch to update the list
      } else {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          alert(`Failed to send request: ${errorData.message || 'Unknown error'}`);
        } catch {
          alert(`Failed to send request: ${errorText || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error sending handover request:', error);
      alert('An unexpected error occurred while sending the request.');
    }
  };

  const columns: IColumn[] = [
    {
      key: 'serialNumber',
      name: 'Serial Number',
      fieldName: 'serialNumber',
      minWidth: 120,
      isResizable: true,
      onRender: (item: Device | undefined) => {
        if (!item) return <Text>-</Text>;
        return (
          <a
            style={{ color: '#0078d4', cursor: 'pointer' }}
            onClick={() => router.push(`/main/devices/${item.serialNumber}`)}
          >
            {item.serialNumber}
          </a>
        );
      },
      onColumnClick: () => handleSort('serialNumber'),
    },
    {
      key: 'category',
      name: 'Category',
      fieldName: 'category',
      minWidth: 80,
      isResizable: true,
      onColumnClick: () => handleSort('category'),
    },
    {
      key: 'model',
      name: 'Model',
      fieldName: 'model',
      minWidth: 100,
      isResizable: true,
      onColumnClick: () => handleSort('model'),
    },
    {
      key: 'manufacture',
      name: 'Manufacture',
      fieldName: 'manufacture',
      minWidth: 120,
      isResizable: true,
      onColumnClick: () => handleSort('manufacture'),
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 150,
      isResizable: true,
      onColumnClick: () => handleSort('description'),
    },
    {
      key: 'status',
      name: 'Status',
      fieldName: 'status',
      minWidth: 80,
      isResizable: true,
      onColumnClick: () => handleSort('status'),
    },
    {
      key: 'users',
      name: 'Users',
      fieldName: 'users',
      minWidth: 300,
      isResizable: true,
      onRender: (item: Device | undefined) => {
        if (!item || !item.users || item.users.length === 0) {
          return <Text styles={{ root: { color: '#888' } }}>No Users Assigned</Text>;
        }

        return (
          <>
            {item.users.map((user) => (
              <div key={user.id || user.badgeNumber} style={{ marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid #eee' }}>
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }} wrap>
                  <Text styles={{ root: { flexShrink: 1, minWidth: '150px' } }}>
                   <Link href={`/main/users/${user.badgeNumber}`}>  <strong>{user.badgeNumber}</strong></Link> — {formatDate(user.receivedDate)} to{' '} {formatDate(user.handoverDate)}
                    
                  </Text>
                  {!user.handoverDate && (
                    <DefaultButton
                      text="Send Handover"
                      onClick={() => openDialog(item.serialNumber, user.badgeNumber)}
                      styles={{ root: { marginLeft: 12, flexShrink: 0 } }}
                    />
                  )}
                </Stack>
                {user.note && (
                  <Text styles={{ root: { fontSize: 12, color: '#555', marginTop: 4 } }}>
                    Note: {user.note}
                  </Text>
                )}
              </div>
            ))}
          </>
        );
      },
    },
  ];

  async function handelExport() {
    try {
      const res = await fetch(`/api/devices?page=0&pageSize=${totalDevices > 0 ? totalDevices : 10000}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        alert('Failed to fetch devices for export');
        return;
      }

      const data = await res.json();
      const allDevices = data.devices;

      if (!allDevices.length) {
        alert('No devices to export');
        return;
      }

      const headers = ['serialNumber', 'category', 'model', 'description', 'manufacture', 'status'];

      const rows = allDevices.map((device: any) => [
        device.serialNumber,
        device.category,
        device.model,
        device.description,
        device.manufacture,
        device.status,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: string[]) =>
          row.map((field) => `"${(field ?? '').toString().replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devices.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Export failed');
    }
  }

  function handelImport(importType: string) {
    let urlToSet = '';
    if (importType === "DevicesList") {
      urlToSet = '/api/devices/import';
    } else if (importType === "DevicesUserList") {
      urlToSet = '/api/devices/import-users';
    }
    setCurrentImportURL(urlToSet);

    const csvFile = document.getElementById('csvFileId') as HTMLInputElement;
    if (csvFile) {
      csvFile.value = '';
      csvFile.click();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !currentImportURL) return;

    const formData = new FormData();
    formData.append('csv', file);

    fetch(currentImportURL, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((res) => {
      if (res.ok) {
        alert('Data imported successfully');
        fetchDevices();
      } else {
        res.text().then(errorText => {
          try {
            const errorJson = JSON.parse(errorText);
            alert(`Import failed: ${errorJson.message || 'Unknown error'}`);
          } catch {
            alert(`Import failed: ${errorText || 'Unknown error'}`);
          }
        }).catch(() => {
          alert('Import failed: Server responded with an error.');
        });
      }
    }).catch(error => {
      console.error('Fetch error during import:', error);
      alert('Import failed due to network error or server not reachable.');
    });
  }

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32 } }}>
      <Text variant="xxLarge" styles={{ root: { fontWeight: 'bold' } }}>Devices</Text>

      <input type="file" id="csvFileId" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />

      {!isClient ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '300px' } }}>
          <Spinner size={SpinnerSize.large} label="Loading page..." />
        </Stack>
      ) : (
        <>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <FluentUIButton icon={<ArrowUploadFilled />} onClick={() => handelImport("DevicesList")}>
              Import Devices
            </FluentUIButton>

            <TooltipHost content="[serialNumber, badgeNumber, receivedDate, handoverDate, note]">
              <FluentUIButton icon={<ArrowUploadFilled />} onClick={() => handelImport("DevicesUserList")}>
                Import Device Users
              </FluentUIButton>
            </TooltipHost>

            <FluentUIButton icon={<ArrowDown12Filled />} onClick={() => handelExport()}>
              Export Devices
            </FluentUIButton>

            <PrimaryButton text="Add New Device" onClick={() => router.push('/main/devices/new')} />
          </Stack>

          <TextField
            placeholder="Search by serialNumber, model or badge number..."
            value={search}
            onChange={(_, val) => setSearch(val || '')}
            styles={{ root: { maxWidth: '400px' } }}
          />

          {isLoading ? (
            <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '300px' } }}>
              <Spinner size={SpinnerSize.large} label="Loading devices..." />
            </Stack>
          ) : (
            <>
              {devices.length === 0 && search === '' ? (
                <Text variant="large" styles={{ root: { textAlign: 'center', marginTop: 50, color: '#666' } }}>
                  No devices found. Add a new device or import data.
                </Text>
              ) : devices.length === 0 && search !== '' ? (
                <Text variant="large" styles={{ root: { textAlign: 'center', marginTop: 50, color: '#666' } }}>
                  No devices found matching your search criteria.
                </Text>
              ) : (
                <DetailsList
                  items={devices}
                  columns={columns}
                  layoutMode={DetailsListLayoutMode.justified}
                  selectionMode={SelectionMode.none}
                  styles={{ root: { marginTop: 10, overflowX: 'auto' } }}
                />
              )}

              <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center" horizontalAlign="end" styles={{ root: { marginTop: 16 } }}>
                <DefaultButton
                  text="Prev"
                  disabled={page === 0 || isLoading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                />
                <Text variant="medium">Page {page + 1} / {totalPages}</Text>
                <DefaultButton
                  text="Next"
                  disabled={page + 1 >= totalPages || isLoading}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                />
              </Stack>
            </>
          )}

          <Dialog
            hidden={!dialogVisible}
            onDismiss={() => setDialogVisible(false)}
            dialogContentProps={{
              type: DialogType.normal,
              title: 'Send Handover Request',
              subText: `To: ${selectedBadge} | Device: ${selectedDeviceSerial}`,
            }}
          >
            <DatePicker
              label="Handover Date"
              value={handoverDate}
              onSelectDate={(date) => setHandoverDate(date ?? undefined)}
              placeholder="Select a date"
            />
            <TextField
              label="Note"
              multiline
              rows={3}
              value={handoverNote}
              onChange={(_, newVal) => setHandoverNote(newVal || '')}
            />
            <DialogFooter>
              <PrimaryButton onClick={handleSendHandoverRequest} text="Send" />
              <DefaultButton onClick={() => setDialogVisible(false)} text="Cancel" />
            </DialogFooter>
          </Dialog>
        </>
      )}
    </Stack>
  );
}