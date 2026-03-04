import { Box, CardContent, Chip, Skeleton, Typography } from '@mui/material';
import { CalendarTodayOutlined, TrendingUpOutlined } from '@mui/icons-material';
import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
    type GridSortModel,
} from '@mui/x-data-grid';
import { useMediaQuery, useTheme } from '@mui/material';
import {useState} from "react";

const PAGE_SIZE = 10;

interface TrafficData {
    date: string;
    visits: number;
}

interface TrafficStatsCardContentProps {
    data: TrafficData[] | undefined;
    isLoading: boolean;
    sortModel: GridSortModel;
    onSortModelChange: (sortModel: GridSortModel) => void;
}

const TrafficStatsCardContent = ({
    data,
    isLoading,
    sortModel,
    onSortModelChange,
}: TrafficStatsCardContentProps) => {
    const [page, setPage] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                    onSortModelChange={onSortModelChange}
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
                    }}
                />
            )}
        </CardContent>
    );
};

export default TrafficStatsCardContent;

