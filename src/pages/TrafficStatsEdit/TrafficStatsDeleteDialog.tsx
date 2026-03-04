import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { type Dayjs } from 'dayjs';

interface TrafficStatsDeleteDialogProps {
    open: boolean;
    selectedDate: Dayjs | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const TrafficStatsDeleteDialog = ({
    open,
    selectedDate,
    isDeleting,
    onClose,
    onConfirm,
}: TrafficStatsDeleteDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    onClick={onClose}
                    variant="outlined"
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                    startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlined />}
                >
                    {isDeleting ? 'Deleting…' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TrafficStatsDeleteDialog;

