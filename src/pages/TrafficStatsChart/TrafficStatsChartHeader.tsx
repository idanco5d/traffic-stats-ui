import { Box, Chip, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
    CalendarMonthOutlined,
    CalendarTodayOutlined,
    CalendarViewWeekOutlined,
    TrendingUpOutlined,
    BarChartOutlined,
} from '@mui/icons-material';
import type {ViewMode} from './chartUtils';

interface TrafficStatsChartHeaderProps {
    dataLength: number | null;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    totalVisits: number;
    peakVisits: number;
    avgVisits: number;
}

const TrafficStatsChartHeader = ({
    dataLength,
    viewMode,
    onViewModeChange,
    totalVisits,
    peakVisits,
    avgVisits,
}: TrafficStatsChartHeaderProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const avgLabel = viewMode === 'daily' ? 'Daily avg' : viewMode === 'weekly' ? 'Weekly avg' : 'Monthly avg';

    const statChips = [
        { label: 'Total', value: totalVisits.toLocaleString(), icon: <TrendingUpOutlined sx={{ fontSize: 14 }} /> },
        { label: 'Peak', value: peakVisits.toLocaleString(), icon: <BarChartOutlined sx={{ fontSize: 14 }} /> },
        { label: avgLabel, value: avgVisits.toLocaleString(), icon: <CalendarTodayOutlined sx={{ fontSize: 14 }} /> },
    ];

    return (
        <Box
            sx={{
                background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                px: { xs: 2.5, sm: 4 },
                pt: { xs: 2, sm: 2.5 },
                pb: { xs: 2, sm: 2.5 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 2, sm: 0 },
            }}
        >
            {/* Title + stat chips */}
            <Box>
                <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    fontWeight={700}
                    sx={{ color: 'white', lineHeight: 1.2 }}
                >
                    Traffic Statistics
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.3, mb: 1.5 }}>
                    {dataLength ? `${dataLength.toLocaleString()} total entries` : 'Loading…'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {statChips.map((chip) => (
                        <Tooltip key={chip.label} title={chip.label}>
                            <Chip
                                icon={chip.icon}
                                label={`${chip.label}: ${chip.value}`}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    backdropFilter: 'blur(4px)',
                                    '& .MuiChip-icon': { color: 'rgba(255,255,255,0.85)' },
                                }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            </Box>

            {/* View toggle */}
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_e, val) => val && onViewModeChange(val)}
                size="small"
                sx={{
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)',
                    '& .MuiToggleButton-root': {
                        color: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        px: { xs: 1.5, sm: 2 },
                        py: 0.75,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        gap: 0.5,
                        '&.Mui-selected': {
                            bgcolor: 'rgba(255,255,255,0.25)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                        },
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    },
                }}
            >
                <ToggleButton value="daily">
                    <CalendarTodayOutlined sx={{ fontSize: 14 }} />
                    {!isMobile && 'Daily'}
                </ToggleButton>
                <ToggleButton value="weekly">
                    <CalendarViewWeekOutlined sx={{ fontSize: 14 }} />
                    {!isMobile && 'Weekly'}
                </ToggleButton>
                <ToggleButton value="monthly">
                    <CalendarMonthOutlined sx={{ fontSize: 14 }} />
                    {!isMobile && 'Monthly'}
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default TrafficStatsChartHeader;

