'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  Box,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import SecurityIcon from '@mui/icons-material/Security';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DevicesIcon from '@mui/icons-material/Devices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, href: '/main' },
  { text: 'Announcements', icon: <CampaignIcon />, href: '/main/announcements' },
  { text: 'Security Incident', icon: <SecurityIcon />, href: '/main/security-incident' },
  { text: 'Tickets', icon: <ConfirmationNumberIcon />, href: '/main/tickets' },
  { text: 'Devices', icon: <DevicesIcon />, href: '/main/devices' },
  { text: 'Assets', icon: <AssignmentIcon />, href: '/main/assets' },
  { text: 'Users', icon: <PeopleIcon />, href: '/main/users' },
  { text: 'Logs', icon: <ReceiptLongIcon />, href: '/main/logs' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Tooltip title="Toggle Sidebar">
            <IconButton edge="start" color="inherit" onClick={() => setOpen(!open)}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
            Next IT
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer (Sidebar) */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #ddd',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <ListItemButton
                
                selected={pathname === item.href}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Space for AppBar
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: 'width 0.3s',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
