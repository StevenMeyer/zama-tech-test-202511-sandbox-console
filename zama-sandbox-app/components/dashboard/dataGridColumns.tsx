import { ApiKey } from "@/lib/key/key";
import { GridColDef } from "@mui/x-data-grid";
import { ReactNode } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import { visuallyHidden } from "@mui/utils";
import Tooltip from "@mui/material/Tooltip";
import { getDateTimeLocal, getDateTimeUTC, isValidDate } from "@/lib/util/datetime";

export const columns: ReadonlyArray<Readonly<GridColDef<ApiKey>>> = [
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
        width: 300,
    },
    {
        field: 'isRevoked',
        headerName: 'Revoked',
        align: 'center',
        editable: false,
        display: 'flex',
        renderCell({ row: key, value }): ReactNode {
            if (value === 'Yes') {
                return <>
                    <span style={visuallyHidden}>Revoked</span>
                    <Tooltip title="Revoked">
                        <CancelIcon color="error" />
                    </Tooltip>
                    {key.isRevoked !== key.persistedData.isRevoked ? (
                        <Tooltip title="This value did not sync. That's because there is no real back-end in this demo.">
                            <SyncDisabledIcon color="disabled" />
                        </Tooltip>
                    ) : undefined}
                </>;
            }
            return <>
                <span style={visuallyHidden}>Not revoked</span>
            </>;
        },
        type: 'string',
        valueGetter(isRevoked: boolean): 'Yes' | 'No' {
            return isRevoked ? 'Yes' : 'No';
        }
    },
    {
        field: 'isExpired',
        headerName: 'Expired',
        display: 'flex',
        align: 'center',
        editable: false,
        renderCell({ row: key, value }): ReactNode {
            if (value === 'Yes') {
                return <>
                    <span style={visuallyHidden}>Expired</span>
                    <Tooltip title={`Expired ${getDateTimeLocal(key.expiresAt!, { omitSameDay: true })}`}>
                        <EventBusyIcon color="error" />
                    </Tooltip>
                </>;
            }
            return <span style={visuallyHidden}>Not expired</span>;
        },
        type: 'string',
        valueGetter(_, key): 'Yes' | 'No' {
            if (!key.expiresAt) {
                return 'No';
            }
            const expires = new Date(key.expiresAt);
            if (!isValidDate(expires)) {
                return 'No';
            }
            return expires > new Date() ? 'No' : 'Yes';
        },
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        editable: false,
        valueGetter(createdAt: Date): string {
            return getDateTimeUTC(createdAt, {
                omitSameDay: true,
            });
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
        valueGetter(expiresAt: string | undefined): string {
            if (!expiresAt) {
                return 'Never';
            }
            return getDateTimeUTC(expiresAt, {
                omitSameDay: true,
            });
        },
    }
];