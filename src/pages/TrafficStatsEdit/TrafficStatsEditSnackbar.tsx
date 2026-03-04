import { Alert, Snackbar } from '@mui/material';
import { type Snack } from './editUtils';

interface TrafficStatsEditSnackbarProps {
    snack: Snack | null;
    onClose: () => void;
}

const TrafficStatsEditSnackbar = ({ snack, onClose }: TrafficStatsEditSnackbarProps) => {
    return (
        <Snackbar
            open={!!snack}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={onClose}
                severity={snack?.severity}
                variant="filled"
                sx={{ borderRadius: 2, minWidth: 280 }}
            >
                {snack?.message}
            </Alert>
        </Snackbar>
    );
};

export default TrafficStatsEditSnackbar;

