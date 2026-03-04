import {type ReactElement, useMemo, useState} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    Skeleton,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { AddCircleOutlined, BarChartOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Dayjs } from 'dayjs';
import { addStat, deleteStat, fetchStats, updateStat } from '../api/trafficStats.ts';

type Mode = 'add' | 'edit' | 'delete';

type Snack = { message: string; severity: 'success' | 'error' };

const toDateStr = (d: Dayjs) => d.format('YYYY-MM-DD');

// Fix 1: Tab icon must be ReactElement, not ReactNode (which includes null)
const tabConfig: { value: Mode; label: string; icon: ReactElement; color: string }[] = [
    { value: 'add',    label: 'Add',    icon: <AddCircleOutlined sx={{ fontSize: 18 }} />, color: '#2e7d32' },
    { value: 'edit',   label: 'Edit',   icon: <EditOutlined sx={{ fontSize: 18 }} />,       color: '#1565c0' },
    { value: 'delete', label: 'Delete', icon: <DeleteOutlined sx={{ fontSize: 18 }} />,     color: '#c62828' },
];

const TrafficStatsEditPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const queryClient = useQueryClient();

    const [mode, setMode] = useState<Mode>('add');
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [visits, setVisits] = useState<string>('');
    const [visitsError, setVisitsError] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [snack, setSnack] = useState<Snack | null>(null);

    const { data, isLoading: datesLoading } = useQuery({
        queryKey: ['trafficDataAll'],
        queryFn: () => fetchStats(),
        placeholderData: (prev) => prev ?? [],
        initialData: [],
    });

    const existingMap = useMemo(() => {
        const map = new Map<string, { id: string; visits: number }>();
        for (const entry of data ?? []) {
            map.set(entry.date, { id: entry.id!, visits: entry.visits });
        }
        return map;
    }, [data]);

    const existingDates = useMemo(() => new Set(existingMap.keys()), [existingMap]);

    const invalidateData = async () => {
        await queryClient.invalidateQueries({ queryKey: ['trafficDataAll'] });
        await queryClient.invalidateQueries({ queryKey: ['trafficData'] });
        await queryClient.invalidateQueries({ queryKey: ['trafficDataChart'] });
    };

    // Fix 2: Reset state in the handler instead of a useEffect to avoid setState-in-effect
    const handleModeChange = (_e: React.SyntheticEvent, newMode: Mode) => {
        setMode(newMode);
        setSelectedDate(null);
        setVisits('');
        setVisitsError('');
    };

    // Fix 2: Pre-fill visits in the date change handler instead of a useEffect
    const handleDateChange = (val: Dayjs | null) => {
        setSelectedDate(val);
        if (mode === 'edit' && val) {
            const existing = existingMap.get(toDateStr(val));
            setVisits(existing ? String(existing.visits) : '');
        } else if (mode !== 'edit') {
            setVisits('');
        }
        setVisitsError('');
    };

    const addMutation = useMutation({
        mutationFn: ({ date, visits }: { date: string; visits: number }) =>
            addStat({ date, visits }),
        onSuccess: async () => {
            await invalidateData();
            setSnack({ message: 'Entry added successfully.', severity: 'success' });
            setSelectedDate(null);
            setVisits('');
        },
        onError: () => setSnack({ message: 'Failed to add entry.', severity: 'error' }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, date, visits }: { id: string; date: string; visits: number }) =>
            updateStat(id, { date, visits }),
        onSuccess: async () => {
            await invalidateData();
            setSnack({ message: 'Entry updated successfully.', severity: 'success' });
        },
        onError: () => setSnack({ message: 'Failed to update entry.', severity: 'error' }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteStat(id),
        onSuccess: async () => {
            await invalidateData();
            setSnack({ message: 'Entry deleted successfully.', severity: 'success' });
            setSelectedDate(null);
        },
        onError: () => setSnack({ message: 'Failed to delete entry.', severity: 'error' }),
    });

    const isBusy = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    const validateVisits = (value: string): boolean => {
        const num = Number(value);
        if (!value.trim()) { setVisitsError('Visits is required.'); return false; }
        if (!Number.isInteger(num) || num < 0) { setVisitsError('Must be a non-negative integer.'); return false; }
        setVisitsError('');
        return true;
    };

    const handleSubmit = () => {
        if (!selectedDate) return;
        const dateStr = toDateStr(selectedDate);
        if (mode === 'add') {
            if (!validateVisits(visits)) return;
            addMutation.mutate({ date: dateStr, visits: Number(visits) });
        } else if (mode === 'edit') {
            if (!validateVisits(visits)) return;
            const existing = existingMap.get(dateStr);
            if (!existing) return;
            updateMutation.mutate({ id: existing.id, date: dateStr, visits: Number(visits) });
        } else {
            setDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (!selectedDate) return;
        const existing = existingMap.get(toDateStr(selectedDate));
        if (!existing) return;
        setDeleteDialogOpen(false);
        deleteMutation.mutate(existing.id);
    };

    const shouldDisableDate = (date: Dayjs) => {
        const key = toDateStr(date);
        if (mode === 'add') return existingDates.has(key);
        return !existingDates.has(key);
    };

    const currentTab = tabConfig.find((t) => t.value === mode)!;

    const canSubmit =
        !!selectedDate &&
        !isBusy &&
        (mode === 'delete' || (visits !== '' && !visitsError));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#f0f4f8',
                    py: { xs: 2, sm: 4 },
                    px: { xs: 1, sm: 2, md: 3 },
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="sm" sx={{ px: { xs: 0.5, sm: 2 } }}>
                    <Card elevation={3} sx={{ borderRadius: { xs: 2, sm: 3 }, overflow: 'hidden' }}>

                        {/* Gradient header */}
                        <Box
                            sx={{
                                background: 'linear-gradient(120deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
                                px: { xs: 2.5, sm: 4 },
                                py: { xs: 2, sm: 2.5 },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.3 }}>
                                <BarChartOutlined sx={{ color: 'rgba(255,255,255,0.85)', fontSize: 22 }} />
                                <Typography
                                    variant={isMobile ? 'h6' : 'h5'}
                                    fontWeight={700}
                                    sx={{ color: 'white', lineHeight: 1.2 }}
                                >
                                    Traffic Statistics Edit Form
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {datesLoading
                                    ? 'Loading entries…'
                                    : `${(data?.length ?? 0).toLocaleString()} existing entries`}
                            </Typography>
                        </Box>

                        {/* Mode tabs */}
                        <Tabs
                            value={mode}
                            onChange={handleModeChange}
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
                                <Tab
                                    key={tab.value}
                                    value={tab.value}
                                    label={tab.label}
                                    icon={tab.icon}
                                    iconPosition="start"
                                />
                            ))}
                        </Tabs>

                        <CardContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
                            {datesLoading ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Skeleton variant="rounded" height={56} />
                                    <Skeleton variant="rounded" height={56} />
                                    <Skeleton variant="rounded" height={42} />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <Alert
                                        severity={mode === 'delete' ? 'warning' : mode === 'edit' ? 'info' : 'success'}
                                        variant="outlined"
                                        sx={{ borderRadius: 2, py: 0.5 }}
                                    >
                                        {mode === 'add' && 'Pick a date that does not yet have an entry.'}
                                        {mode === 'edit' && 'Pick an existing date to update its visit count.'}
                                        {mode === 'delete' && 'Pick an existing date to permanently remove it.'}
                                    </Alert>

                                    <DatePicker
                                        label="Date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        shouldDisableDate={shouldDisableDate}
                                        slotProps={{
                                            textField: { fullWidth: true, size: 'medium' },
                                        }}
                                    />

                                    {mode !== 'delete' && (
                                        <TextField
                                            label="Visits"
                                            type="number"
                                            fullWidth
                                            value={visits}
                                            onChange={(e) => {
                                                setVisits(e.target.value);
                                                if (visitsError) validateVisits(e.target.value);
                                            }}
                                            onBlur={() => validateVisits(visits)}
                                            error={!!visitsError}
                                            helperText={visitsError || ' '}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <BarChartOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        </InputAdornment>
                                                    ),
                                                    inputProps: { min: 0, step: 1 },
                                                },
                                            }}
                                        />
                                    )}

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={!canSubmit}
                                        onClick={handleSubmit}
                                        startIcon={isBusy
                                            ? <CircularProgress size={18} color="inherit" />
                                            : currentTab.icon}
                                        sx={{
                                            mt: 0.5,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            py: 1.3,
                                            bgcolor: currentTab.color,
                                            '&:hover': { bgcolor: currentTab.color, filter: 'brightness(0.9)' },
                                            '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                                        }}
                                    >
                                        {isBusy
                                            ? 'Processing…'
                                            : mode === 'add'
                                                ? 'Add Entry'
                                                : mode === 'edit'
                                                    ? 'Save Changes'
                                                    : 'Delete Entry'}
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                // Fix 3: PaperProps is deprecated — use slotProps.paper instead
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the entry for{' '}
                        <strong>{selectedDate ? selectedDate.format('MMM D, YYYY') : ''}</strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        startIcon={deleteMutation.isPending
                            ? <CircularProgress size={16} color="inherit" />
                            : <DeleteOutlined />}
                    >
                        {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/error snackbar */}
            <Snackbar
                open={!!snack}
                autoHideDuration={4000}
                onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnack(null)}
                    severity={snack?.severity}
                    variant="filled"
                    sx={{ borderRadius: 2, minWidth: 280 }}
                >
                    {snack?.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default TrafficStatsEditPage;