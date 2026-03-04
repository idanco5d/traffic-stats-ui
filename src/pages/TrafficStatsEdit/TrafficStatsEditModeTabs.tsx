import { Tab, Tabs } from '@mui/material';
import { AddCircleOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import type { SyntheticEvent } from 'react';
import type { Mode } from './editUtils';

interface TrafficStatsEditModeTabsProps {
    mode: Mode;
    onModeChange: (mode: Mode) => void;
}

const TrafficStatsEditModeTabs = ({ mode, onModeChange }: TrafficStatsEditModeTabsProps) => {
    const tabConfig = [
        { value: 'add' as const, label: 'Add', icon: <AddCircleOutlined sx={{ fontSize: 18 }} />, color: '#2e7d32' },
        { value: 'edit' as const, label: 'Edit', icon: <EditOutlined sx={{ fontSize: 18 }} />, color: '#1565c0' },
        {
            value: 'delete' as const,
            label: 'Delete',
            icon: <DeleteOutlined sx={{ fontSize: 18 }} />,
            color: '#c62828',
        },
    ];

    const currentTab = tabConfig.find((t) => t.value === mode)!;

    const handleChange = (_e: SyntheticEvent, newMode: Mode) => {
        onModeChange(newMode);
    };

    return (
        <Tabs
            value={mode}
            onChange={handleChange}
            variant="fullWidth"
            sx={{
                borderBottom: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
                '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    gap: 0.5,
                    minHeight: 48,
                },
                '& .MuiTabs-indicator': {
                    backgroundColor: currentTab.color,
                    height: 3,
                },
                '& .Mui-selected': {
                    color: `${currentTab.color} !important`,
                },
            }}
        >
            {tabConfig.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
        </Tabs>
    );
};

export default TrafficStatsEditModeTabs;

