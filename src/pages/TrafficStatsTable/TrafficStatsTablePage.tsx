import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Alert, Box, Card, Container,} from '@mui/material';
import {type GridSortModel} from '@mui/x-data-grid';
import {fetchStats} from '../../api/trafficStats.ts';
import TrafficStatsCardHeader from './TrafficStatsCardHeader.tsx';
import TrafficStatsCardContent from './TrafficStatsCardContent.tsx';

const TrafficStatsTablePage = () => {
    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'date', sort: 'desc' },
    ]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['trafficData'],
        queryFn: () => fetchStats(),
        placeholderData: (prev) => prev ?? [],
        initialData: [],
    });


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
                    maxWidth: { xs: '100%', sm: '100%', md: '1600px' },
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
                    <TrafficStatsCardHeader dataLength={data?.length ?? null} isLoading={isLoading} />
                    <TrafficStatsCardContent
                        data={data}
                        isLoading={isLoading}
                        sortModel={sortModel}
                        onSortModelChange={setSortModel}
                    />
                </Card>
            </Container>
        </Box>
    );
};

export default TrafficStatsTablePage;