import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Skeleton,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    CalendarMonthOutlined,
    CalendarTodayOutlined,
    CalendarViewWeekOutlined,
    TrendingUpOutlined,
    BarChartOutlined,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { fetchStats } from '../api/trafficStats.ts';

type ViewMode = 'daily' | 'weekly' | 'monthly';

interface AggregatedPoint {
    label: string;
    visits: number;
}

const getISOWeekLabel = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    // ISO week: Monday-based
    const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayOfWeek);
    return `${monday.getFullYear()}-W${String(getISOWeek(monday)).padStart(2, '0')}`;
};

const getISOWeek = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const getMonthLabel = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    return `${year}-${month}`;
};

const formatMonthLabel = (label: string): string => {
    const [year, month] = label.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatWeekLabel = (label: string): string => {
    // label = "2024-W03" → show "Jan W3 '24"
    const [yearStr, weekPart] = label.split('-W');
    const week = parseInt(weekPart, 10);
    const year = parseInt(yearStr, 10);
    // Find date of that Monday
    const jan4 = new Date(year, 0, 4);
    const startOfWeek = new Date(jan4);
    startOfWeek.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
    return startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDayLabel = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const TrafficStatisticsChartPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [viewMode, setViewMode] = useState<ViewMode>('daily');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['trafficDataChart'],
        queryFn: () => fetchStats(),
        placeholderData: (prev) => prev ?? [],
        initialData: [],
    });

    const aggregated: AggregatedPoint[] = useMemo(() => {
        const raw = data ?? [];
        if (viewMode === 'daily') {
            return [...raw]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((entry) => ({ label: entry.date, visits: entry.visits }));
        }

        const map = new Map<string, number>();
        for (const entry of raw) {
            const key = viewMode === 'weekly' ? getISOWeekLabel(entry.date) : getMonthLabel(entry.date);
            map.set(key, (map.get(key) ?? 0) + entry.visits);
        }
        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, visits]) => ({ label, visits }));
    }, [data, viewMode]);

    const xLabels = useMemo(() => {
        if (viewMode === 'daily') return aggregated.map((p) => formatDayLabel(p.label));
        if (viewMode === 'weekly') return aggregated.map((p) => formatWeekLabel(p.label));
        return aggregated.map((p) => formatMonthLabel(p.label));
    }, [aggregated, viewMode]);

    const yValues = aggregated.map((p) => p.visits);

    const totalVisits = yValues.reduce((a, b) => a + b, 0);
    const peakVisits = yValues.length > 0 ? Math.max(...yValues) : 0;
    const avgVisits = yValues.length > 0 ? Math.round(totalVisits / yValues.length) : 0;

    const chartHeight = isMobile ? 260 : isTablet ? 340 : 420;

    const statChips = [
        { label: 'Total', value: totalVisits.toLocaleString(), icon: <TrendingUpOutlined sx={{ fontSize: 14 }} /> },
        { label: 'Peak', value: peakVisits.toLocaleString(), icon: <BarChartOutlined sx={{ fontSize: 14 }} /> },
        { label: viewMode === 'daily' ? 'Daily avg' : viewMode === 'weekly' ? 'Weekly avg' : 'Monthly avg', value: avgVisits.toLocaleString(), icon: <CalendarTodayOutlined sx={{ fontSize: 14 }} /> },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f0f4f8',
                py: { xs: 2, sm: 4 },
                px: { xs: 1, sm: 2, md: 3 },
            }}
        >
            <Container
                maxWidth={false}
                sx={{
                    maxWidth: { xs: '100%', md: '1600px' },
                    px: { xs: 0.5, sm: 2 },
                }}
            >
                {isError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        Failed to load traffic data. Please try again later.
                    </Alert>
                )}

                <Card
                    elevation={3}
                    sx={{
                        borderRadius: { xs: 2, sm: 3 },
                        overflow: 'hidden',
                        mx: { xs: 0.5, sm: 0 },
                    }}
                >
                    {/* Gradient header */}
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
                                {data?.length
                                    ? `${data.length.toLocaleString()} total entries`
                                    : 'Loading…'}
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
                            onChange={(_e, val) => val && setViewMode(val)}
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

                    <CardContent sx={{ p: 0, pb: '0 !important' }}>
                        {isLoading ? (
                            <Box sx={{ px: 3, pt: 3, pb: 2 }}>
                                <Skeleton variant="rounded" width="100%" height={chartHeight} />
                            </Box>
                        ) : (
                            <Box sx={{ px: { xs: 0, sm: 1 }, pt: 2, pb: 1 }}>
                                <LineChart
                                    xAxis={[{
                                        scaleType: 'point',
                                        data: xLabels,
                                        tickLabelStyle: {
                                            fontSize: isMobile ? 10 : 12,
                                            fill: '#64748b',
                                        },
                                        // Show fewer ticks on mobile to avoid crowding
                                        tickInterval: isMobile
                                            ? (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 6) === 0
                                            : isTablet
                                                ? (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 10) === 0
                                                : (_value: unknown, index: number) => index % Math.ceil(xLabels.length / 18) === 0,
                                    }]}
                                    yAxis={[{
                                        width: isMobile ? 50 : 65,
                                        tickLabelStyle: {
                                            fontSize: isMobile ? 10 : 12,
                                            fill: '#64748b',
                                        },
                                        valueFormatter: (v: number) =>
                                            v >= 1_000_000
                                                ? `${(v / 1_000_000).toFixed(1)}M`
                                                : v >= 1000
                                                    ? `${(v / 1000).toFixed(0)}k`
                                                    : String(v),
                                    }]}
                                    series={[{
                                        data: yValues,
                                        label: 'Visits',
                                        area: true,
                                        showMark: viewMode !== 'daily' || yValues.length <= 60,
                                        curve: 'monotoneX',
                                        color: '#1976d2',
                                    }]}
                                    height={chartHeight}
                                    margin={{
                                        left: isMobile ? 10 : 16,
                                        right: isMobile ? 12 : 24,
                                        top: 16,
                                        bottom: isMobile ? 36 : 44,
                                    }}
                                    grid={{ horizontal: true }}
                                    sx={{
                                        // Area gradient fill
                                        '& .MuiAreaElement-root': {
                                            fill: 'url(#areaGradient)',
                                        },
                                        '& .MuiLineElement-root': {
                                            strokeWidth: 2.5,
                                        },
                                        '& .MuiMarkElement-root': {
                                            strokeWidth: 2,
                                            r: 3,
                                            fill: 'white',
                                            stroke: '#1976d2',
                                        },
                                        '& .MuiChartsGrid-line': {
                                            stroke: '#e2e8f0',
                                            strokeDasharray: '4 4',
                                        },
                                        '& .MuiChartsAxis-line': {
                                            stroke: '#cbd5e1',
                                        },
                                        '& .MuiChartsAxis-tick': {
                                            stroke: '#cbd5e1',
                                        },
                                        '& .MuiChartsLegend-root': {
                                            display: 'none',
                                        },
                                    }}
                                >
                                    {/* SVG gradient definition injected as child */}
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1976d2" stopOpacity={0.25} />
                                            <stop offset="100%" stopColor="#1976d2" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                </LineChart>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default TrafficStatisticsChartPage;