import { FC, ReactNode } from "react";
import { ApiKey } from "../api-key/apiKey";
import { DataGrid } from "@mui/x-data-grid";
import { GridColDef } from "@mui/x-data-grid";
import { getDateTimeOmitSameDay } from "../utils/time";
import { Box, Button, Tooltip } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PendingIcon from '@mui/icons-material/Pending';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { visuallyHidden } from '@mui/utils';

interface Props {
    apiKeys: readonly ApiKey[];
}

const columns: readonly GridColDef<ApiKey>[] = [
    {
        field: 'name',
        headerName: 'Key name',
        description: 'Human-readable name for the API key',
        editable: false,
    },
    {
        field: 'maskedKey',
        headerName: 'Masked key',
        description: 'The partial API key value',
        editable: false,
        renderCell({ row: key, value }): ReactNode {
            if (key.hasUnseenKey) {
                return <Button
                    startIcon={<VisibilityIcon />}
                >
                    View key
                </Button>;
            }
            if (key.isConfirmedCreated) {
                return value;
            }
            return <><PendingIcon /> Pending</>;
        },
        valueGetter(mask, key): string {
            return key.isConfirmedCreated ? mask : 'Pending';
        },
    },
    {
        field: 'isRevoked',
        headerName: 'Revoked',
        editable: false,
        display: 'flex',
        renderCell({ value }): ReactNode {
            if (value === 'Yes') {
                return <>
                    <span style={visuallyHidden}>Revoked</span>
                    <Tooltip title="Revoked">
                        <CancelIcon color="error" />
                    </Tooltip>
                </>;
            }
            return <>
                <span style={visuallyHidden}>Not revoked</span>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloseIcon />}
                >
                    Revoke
                </Button>
            </>;
        },
        valueGetter(isRevoked: boolean): 'Yes' | 'No' {
            return isRevoked ? 'Yes' : 'No';
        },
    },
    {
        field: 'isExpired',
        headerName: 'Expired',
        display: 'flex',
        editable: false,
        renderCell({ row: key, value }): ReactNode {
            if (value === 'Yes') {
                return <>
                    <span style={visuallyHidden}>Expired</span>
                    <Tooltip title={`Expired ${getDateTimeOmitSameDay(key.expiresAt!)}`}>
                        <EventBusyIcon color="error" />
                    </Tooltip>
                </>;
            }
            return <span style={visuallyHidden}>Not expired</span>;
        },
        valueGetter(isExpired: boolean): 'Yes' | 'No' {
            return isExpired ? 'Yes' : 'No';
        },
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        editable: false,
        valueGetter(createdAt: Date): string {
            return getDateTimeOmitSameDay(createdAt);
        },
    },
    {
        field: 'expiresAt',
        headerName: 'Expires',
        display: 'flex',
        editable: false,
        renderCell({ value }): ReactNode {
            if (value === 'Never') {
                return <>
                    <span style={visuallyHidden}>Never</span>
                    <Tooltip title="This key has no expiry date">
                        <AllInclusiveIcon />
                    </Tooltip>
                </>;
            }
            return value;
        },
        valueGetter(expiresAt: Date | undefined): string {
            if (!expiresAt) {
                return 'Never';
            }
            return getDateTimeOmitSameDay(expiresAt);
        },
    }
];

export const KeyGrid: FC<Props> = function KeyGrid({ apiKeys }) {
    return (
        <DataGrid
            disableRowSelectionOnClick
            rows={apiKeys}
            columns={columns}
        />
    );
}
