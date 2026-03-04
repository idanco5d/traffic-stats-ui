import {useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Box, Card, CardContent, Container} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {type Dayjs} from 'dayjs';
import {addStat, deleteStat, fetchStats, updateStat} from '../../api/trafficStats.ts';
import {type Mode, type Snack, toDateStr} from './editUtils';
import TrafficStatsEditHeader from './TrafficStatsEditHeader';
import TrafficStatsEditModeTabs from './TrafficStatsEditModeTabs';
import TrafficStatsEditForm from './TrafficStatsEditForm';
import TrafficStatsDeleteDialog from './TrafficStatsDeleteDialog';
import TrafficStatsEditSnackbar from './TrafficStatsEditSnackbar';

const TrafficStatsEditPage = () => {
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

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
        setSelectedDate(null);
        setVisits('');
        setVisitsError('');
    };

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
        mutationFn: ({ date, visits }: { date: string; visits: number }) => addStat({ date, visits }),
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
        if (!value.trim()) {
            setVisitsError('Visits is required.');
            return false;
        }
        if (!Number.isInteger(num) || num < 0) {
            setVisitsError('Must be a non-negative integer.');
            return false;
        }
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
                        {/* Header Component */}
                        <TrafficStatsEditHeader dataLength={data?.length ?? 0} isLoading={datesLoading} />

                        {/* Mode Tabs Component */}
                        <TrafficStatsEditModeTabs mode={mode} onModeChange={handleModeChange} />

                        {/* Form Content */}
                        <CardContent sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
                            {/* Form Component */}
                            <TrafficStatsEditForm
                                isLoading={datesLoading}
                                mode={mode}
                                selectedDate={selectedDate}
                                visits={visits}
                                visitsError={visitsError}
                                isBusy={isBusy}
                                existingDates={existingDates}
                                onDateChange={handleDateChange}
                                onVisitsChange={setVisits}
                                onValidateVisits={validateVisits}
                                onSubmit={handleSubmit}
                            />
                        </CardContent>
                    </Card>
                </Container>
            </Box>

            {/* Delete Dialog Component */}
            <TrafficStatsDeleteDialog
                open={deleteDialogOpen}
                selectedDate={selectedDate}
                isDeleting={deleteMutation.isPending}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* Snackbar Component */}
            <TrafficStatsEditSnackbar snack={snack} onClose={() => setSnack(null)} />
        </LocalizationProvider>
    );
};

export default TrafficStatsEditPage;