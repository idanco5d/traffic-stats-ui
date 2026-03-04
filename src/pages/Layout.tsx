import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    BarChartOutlined,
    EditOutlined,
    MenuOutlined,
    ShowChartOutlined,
    TableRowsOutlined,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const navItems = [
    {
        label: 'Statistics Table',
        path: '/traffic-stats-table',
        icon: <TableRowsOutlined />,
    },
    {
        label: 'Statistics Chart',
        path: '/traffic-stats-chart',
        icon: <ShowChartOutlined />,
    },
    {
        label: 'Edit Entries',
        path: '/traffic-stats-edit',
        icon: <EditOutlined />,
    },
];

const Layout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Drawer header */}
            <Box
                sx={{
                    background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                }}
            >
                <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'white', lineHeight: 1.2 }}>
                        Traffic Statistics
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)' }}>
                        Navigation
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* Nav items */}
            <List sx={{ pt: 1, px: 1, flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                bgcolor: isActive ? 'rgba(21, 101, 192, 0.1)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(21, 101, 192, 0.07)' },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 38,
                                    color: isActive ? '#1565c0' : 'text.secondary',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                slotProps={{
                                    primary: {
                                        fontWeight: isActive ? 700 : 400,
                                        fontSize: '0.9rem',
                                        color: isActive ? '#1565c0' : 'text.primary',
                                    },
                                }}
                            />
                            {isActive && (
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 24,
                                        borderRadius: 2,
                                        bgcolor: '#1565c0',
                                        ml: 1,
                                    }}
                                />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Top AppBar */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Toolbar sx={{ gap: 1.5 }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open navigation menu"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}
                    >
                        <MenuOutlined />
                    </IconButton>

                    <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />

                    <Typography variant="h6" fontWeight={700} sx={{ color: 'white', letterSpacing: '0.01em' }}>
                        Traffic Statistics
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Navigation drawer */}
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                slotProps={{ paper: { sx: { width: DRAWER_WIDTH, borderRight: 'none' } } }}
            >
                {drawer}
            </Drawer>

            {/* Page content */}
            <Box component="main" sx={{ flex: 1, bgcolor: '#f0f4f8' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;