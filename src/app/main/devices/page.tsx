'use client';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { Stack } from '@fluentui/react/lib/Stack';
import React from 'react'
import { useEffect, useState } from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { Button } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';
import {ArrowUploadFilled, ArrowDown12Filled} from "@fluentui/react-icons";
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button'; 
import { TextField } from '@fluentui/react/lib/TextField';  
 

//src/app/main/devices


interface DeviceUserHistory {
  id:string
  badgeNumber: string;
  receivedDate: string;   // ISO string or Date
  handoverDate: string | null; // null if still assigned
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


const Devicespage = () => {
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(totalDevices / pageSize);


  const fetchDevices = async () => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search: search,
    sortField: sortField || '',
    sortOrder: sortAsc ? 'asc' : 'desc'
  });

  const res = await fetch(`/api/devices?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) return;

  const data = await res.json();
  setDevices(data.devices);
  setTotalDevices(data.total);
};

const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };


 useEffect(() => {
  fetchDevices();
}, [page, search, sortField, sortAsc]);


const columns: IColumn[] = [
    {
      key: 'serialNumber',
      name: 'Serial Number',
      fieldName: 'serialNumber',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('serialNumber'),
    },
    {
      key: 'category',
      name: 'Category',
      fieldName: 'category',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('category'),
    },
     {
      key: 'model',
      name: 'Model',
      fieldName: 'model',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('category'),
    },

      {
      key: 'manufacture',
      name: 'Manufacture',
      fieldName: 'manufacture',
      minWidth: 200,
      isResizable: true,
      onColumnClick: () => handleSort('category'),
    },
];

 async function handelExport() {
  try {
    const res = await fetch(`/api/devices?page=0&pageSize=10000`, {
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

    // Desired column headers
    const headers = ['serialNumber', 'category', 'model', 'description'];

    // Map rows in correct column order
    const rows = allDevices.map((device: any) => [
      device.serialNumber,
      device.category,
      device.model,
      device.description,
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
    a.download = 'devices.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed');
  }
}

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

    fetch('/api/devices/import', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }).then((res) => {
    if (res.ok) {
      alert('Devices imported successfully');
      //reload user list
      fetchDevices();
      
    } else {
      alert('Import failed');
    }
  });
}



  return (
    
     <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 32 } }}>
      <input type="file" id="csvFileId" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
        <Stack horizontal horizontalAlign="space-between">
          <Text variant="xxLarge">Devices</Text>

           <Button icon={<ArrowUploadFilled />} text="Import Devices" onClick={() => handelImport()} > Import Devices</Button>

            <Button icon={<ArrowDown12Filled />} text="Export Users" onClick={() => handelExport()} > Export Users</Button>

            <PrimaryButton text="Add New Device" onClick={() => router.push('/main/devices/new')} />

        </Stack>

         <TextField
                placeholder="Search by serialNumber, model or badge number..."
                value={search}
                onChange={(_, val) => setSearch(val || '')}
              />

              <DetailsList
                      items={devices}
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


  )
}

export default Devicespage