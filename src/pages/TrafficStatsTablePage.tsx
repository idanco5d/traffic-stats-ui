import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    IconButton,
    Skeleton,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {CalendarTodayOutlined, DownloadOutlined, FilterListOutlined, TrendingUpOutlined,} from '@mui/icons-material';
import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
    type GridSortModel,
    useGridApiContext,
} from '@mui/x-data-grid';
import {fetchStats} from '../api/trafficStats.ts';

const PAGE_SIZE = 10;

// Renders inside the DataGrid context — can use useGridApiContext safely
const HeaderActions = () => {
    const apiRef = useGridApiContext();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', width: '100%', pr: 0.5 }}>
            <Tooltip title="Filter">
                <IconButton
                    size="small"
                    onClick={() => apiRef.current.showFilterPanel()}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#1565c0', bgcolor: 'rgba(21,101,192,0.08)' } }}
                >
                    <FilterListOutlined sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
                <IconButton
                    size="small"
                    onClick={() => apiRef.current.exportDataAsCsv()}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#1565c0', bgcolor: 'rgba(21,101,192,0.08)' } }}
                >
                    <DownloadOutlined sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

const TrafficStatsTablePage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState(0);
    const [sortModel, setSortModel] = useState<GridSortModel>([
        { field: 'date', sort: 'desc' },
    ]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['trafficData'],
        queryFn: () => fetchStats(),
        placeholderData: (prev) => prev ?? [],
        initialData: [],
    });

    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const rows = (data ?? []).map((entry, index) => ({
        id: index,
        date: entry.date,
        visits: entry.visits,
    }));

    const actionsColumn: GridColDef = {
        field: '__actions__',
        headerName: '',
        width: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        resizable: false,
        renderHeader: () => <HeaderActions />,
        renderCell: () => null,
    };

    const desktopColumns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 180,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayOutlined sx={{ fontSize: 15, color: '#64b5f6' }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {formatDate(params.value)}
                    </Typography>
                </Box>
            ),
            sortComparator: (a, b) => a.localeCompare(b),
        },
        {
            field: 'visits',
            headerName: 'Visits',
            flex: 1,
            minWidth: 160,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpOutlined sx={{ fontSize: 15, color: '#66bb6a' }} />
                    <Chip
                        label={params.value}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(21, 101, 192, 0.08)',
                            color: '#1565c0',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            border: '1px solid rgba(21, 101, 192, 0.15)',
                        }}
                    />
                </Box>
            ),
        },
        actionsColumn,
    ];

    const mobileColumns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 110,
            renderCell: (params: GridRenderCellParams) => (
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
                    {formatDate(params.value)}
                </Typography>
            ),
            sortComparator: (a, b) => a.localeCompare(b),
        },
        {
            field: 'visits',
            headerName: 'Visits',
            flex: 1,
            minWidth: 90,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params: GridRenderCellParams) => (
                <Chip
                    label={params.value.toLocaleString()}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(21, 101, 192, 0.08)',
                        color: '#1565c0',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: '1px solid rgba(21, 101, 192, 0.15)',
                    }}
                />
            ),
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

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

                {/* Single unified card: title header + table */}
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: { xs: 2, sm: 3 },
                        overflow: 'hidden',
                        mx: { xs: 0.5, sm: 0 },
                    }}
                >
                    {/* Card header */}
                    <Box
                        sx={{
                            background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                            px: { xs: 2.5, sm: 4 },
                            py: { xs: 2, sm: 2.5 },
                        }}
                    >
                        <Typography
                            variant={isMobile ? 'h6' : 'h5'}
                            fontWeight={700}
                            sx={{ color: 'white', lineHeight: 1.2 }}
                        >
                            Traffic Statistics
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', mt: 0.3 }}>
                            {data
                                ? `${data.length.toLocaleString()} total entries`
                                : 'Loading…'}
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                        {isLoading ? (
                            <Box sx={{ p: 2 }}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                                        <Skeleton variant="text" width="40%" height={36} />
                                        <Skeleton variant="text" width="30%" height={36} sx={{ ml: 'auto' }} />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                sortModel={sortModel}
                                onSortModelChange={setSortModel}
                                paginationModel={{ page, pageSize: PAGE_SIZE }}
                                onPaginationModelChange={(model) => setPage(model.page)}
                                rowCount={data?.length ?? 0}
                                paginationMode="client"
                                pageSizeOptions={[PAGE_SIZE]}
                                disableRowSelectionOnClick
                                autoHeight
                                sx={{
                                    border: 'none',
                                    fontFamily: 'inherit',
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: '#f8fafc',
                                        borderBottom: '2px solid #e2e8f0',
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 700,
                                        color: 'text.secondary',
                                        textTransform: 'uppercase',
                                        fontSize: '0.72rem',
                                        letterSpacing: '0.06em',
                                    },
                                    '& .MuiDataGrid-row:nth-of-type(even)': {
                                        bgcolor: '#fafafa',
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        bgcolor: '#e3f2fd',
                                        transition: 'background-color 0.15s',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #f1f5f9',
                                        py: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        borderTop: '2px solid #e2e8f0',
                                        bgcolor: '#f8fafc',
                                    },
                                    '& .MuiDataGrid-sortIcon': {
                                        color: '#1565c0',
                                    },
                                    '& .MuiDataGrid-columnSeparator': {
                                        display: 'none',
                                    },
                                    '& .MuiDataGrid-columnHeader[data-field="__actions__"] .MuiDataGrid-columnHeaderTitleContainer': {
                                        justifyContent: 'flex-end',
                                    },
                                }}
                            />
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default TrafficStatsTablePage;