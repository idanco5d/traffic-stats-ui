import {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Alert, Box, Card, Container,} from '@mui/material';
import {fetchStats} from '../../api/trafficStats.ts';
import {aggregateData, formatDayLabel, formatMonthLabel, formatWeekLabel, type ViewMode} from './chartUtils';
import TrafficStatsChartHeader from './TrafficStatsChartHeader';
import TrafficStatsChartContent from './TrafficStatsChartContent';

const TrafficStatisticsChartPage = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('daily');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['trafficDataChart'],
        queryFn: () => fetchStats(),
        placeholderData: (prev) => prev ?? [],
        initialData: [],
    });

    const aggregated = useMemo(() => aggregateData(data, viewMode), [data, viewMode]);

    const xLabels = useMemo(() => {
        if (viewMode === 'daily') return aggregated.map((p) => formatDayLabel(p.label));
        if (viewMode === 'weekly') return aggregated.map((p) => formatWeekLabel(p.label));
        return aggregated.map((p) => formatMonthLabel(p.label));
    }, [aggregated, viewMode]);

    const yValues = aggregated.map((p) => p.visits);

    const totalVisits = yValues.reduce((a, b) => a + b, 0);
    const peakVisits = yValues.length > 0 ? Math.max(...yValues) : 0;
    const avgVisits = yValues.length > 0 ? Math.round(totalVisits / yValues.length) : 0;


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
                    <TrafficStatsChartHeader
                        dataLength={data?.length ?? null}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        totalVisits={totalVisits}
                        peakVisits={peakVisits}
                        avgVisits={avgVisits}
                    />
                    <TrafficStatsChartContent
                        isLoading={isLoading}
                        xLabels={xLabels}
                        yValues={yValues}
                        viewMode={viewMode}
                    />
                </Card>
            </Container>
        </Box>
    );
};

export default TrafficStatisticsChartPage;