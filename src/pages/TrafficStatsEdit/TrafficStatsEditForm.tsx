import { Alert, Box, Button, CircularProgress, InputAdornment, Skeleton, TextField } from '@mui/material';
import { BarChartOutlined, AddCircleOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { type Dayjs } from 'dayjs';
import { type Mode, getAlertSeverity, getModeMessage, getButtonLabel, toDateStr } from './editUtils';

interface TrafficStatsEditFormProps {
    isLoading: boolean;
    mode: Mode;
    selectedDate: Dayjs | null;
    visits: string;
    visitsError: string;
    isBusy: boolean;
    existingDates: Set<string>;
    onDateChange: (date: Dayjs | null) => void;
    onVisitsChange: (value: string) => void;
    onValidateVisits: (value: string) => void;
    onSubmit: () => void;
}

const TrafficStatsEditForm = ({
    isLoading,
    mode,
    selectedDate,
    visits,
    visitsError,
    isBusy,
    existingDates,
    onDateChange,
    onVisitsChange,
    onValidateVisits,
    onSubmit,
}: TrafficStatsEditFormProps) => {
    const modeIcons = {
        add: <AddCircleOutlined sx={{ fontSize: 18 }} />,
        edit: <EditOutlined sx={{ fontSize: 18 }} />,
        delete: <DeleteOutlined sx={{ fontSize: 18 }} />,
    };

    const modeColors = {
        add: '#2e7d32',
        edit: '#1565c0',
        delete: '#c62828',
    };

    const shouldDisableDate = (date: Dayjs) => {
        const key = toDateStr(date);
        if (mode === 'add') return existingDates.has(key);
        return !existingDates.has(key);
    };

    const canSubmit = !!selectedDate && !isBusy && (mode === 'delete' || (visits !== '' && !visitsError));

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={56} />
                <Skeleton variant="rounded" height={42} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Alert
                severity={getAlertSeverity(mode)}
                variant="outlined"
                sx={{ borderRadius: 2, py: 0.5 }}
            >
                {getModeMessage(mode)}
            </Alert>

            <DatePicker
                label="Date"
                value={selectedDate}
                onChange={onDateChange}
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
                        onVisitsChange(e.target.value);
                        if (visitsError) onValidateVisits(e.target.value);
                    }}
                    onBlur={() => onValidateVisits(visits)}
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
                onClick={onSubmit}
                startIcon={isBusy ? <CircularProgress size={18} color="inherit" /> : modeIcons[mode]}
                sx={{
                    mt: 0.5,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    py: 1.3,
                    bgcolor: modeColors[mode],
                    '&:hover': { bgcolor: modeColors[mode], filter: 'brightness(0.9)' },
                    '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                }}
            >
                {getButtonLabel(mode, isBusy)}
            </Button>
        </Box>
    );
};

export default TrafficStatsEditForm;

