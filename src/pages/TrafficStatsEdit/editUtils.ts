import { type Dayjs } from 'dayjs';

export type Mode = 'add' | 'edit' | 'delete';
export type Snack = { message: string; severity: 'success' | 'error' };

export const toDateStr = (d: Dayjs): string => d.format('YYYY-MM-DD');

export const getModeMessage = (mode: Mode): string => {
    switch (mode) {
        case 'add':
            return 'Pick a date that does not yet have an entry.';
        case 'edit':
            return 'Pick an existing date to update its visit count.';
        case 'delete':
            return 'Pick an existing date to permanently remove it.';
    }
};

export const getAlertSeverity = (mode: Mode): 'success' | 'info' | 'warning' => {
    switch (mode) {
        case 'add':
            return 'success';
        case 'edit':
            return 'info';
        case 'delete':
            return 'warning';
    }
};

export const getButtonLabel = (mode: Mode, isBusy: boolean): string => {
    if (isBusy) return 'Processing…';
    switch (mode) {
        case 'add':
            return 'Add Entry';
        case 'edit':
            return 'Save Changes';
        case 'delete':
            return 'Delete Entry';
    }
};

