'use client';
import { ApiKey, ApiKeyExisting } from "@/lib/key/key";
import { getDateTimeLocal, getDateTimeUTC } from "@/lib/util/datetime";
import { memo, PropsWithChildren, ReactNode, useContext } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import { KeyDispatchContext } from "@/lib/key/context";
import { KeyActionType } from "@/lib/key/key.reducer";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import MuiCard from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface PropDefaults {
    name: ReactNode;
    description?: ReactNode;
}

interface Props<P extends keyof ApiKeyExisting> {
    apiKey: ApiKey;
    prop: P;
}

interface PropMapValue<P extends keyof ApiKeyExisting> {
    name: ReactNode;
    description?: ReactNode;
    renderChildren?(value: ApiKeyExisting[P], prop: P, key: ApiKey): ReactNode;
    renderActions?(value: ApiKeyExisting[P], prop: P, key: ApiKey): ReactNode;
}

type PropMap = {[K in keyof ApiKeyExisting]?: PropMapValue<K>};

const propMap: PropMap = {
    name: {
        name: 'Key name',
        description: 'Human-readable key name',
    },
    maskedKey: {
        name: 'Masked key',
        description: 'A partial key',
        renderChildren(value): ReactNode {
            return <Typography component="span">
                {value.substring(0, value.length - 6)}
                <Typography component="span" variant="h6">{value.substring(value.length - 6)}</Typography>
            </Typography>;
        },
    },
    createdAt: {
        name: 'Created at',
        description: <abbr title="Co-ordinated Universal Time">UTC</abbr>,
        renderChildren(value): ReactNode {
            return getDateTimeUTC(value, {
                omitSameDay: true,
            });
        }
    },
    isRevoked: {
        name: 'Revoked',
        renderActions(value, _, key): ReactNode {
            const dispatch = useContext(KeyDispatchContext);
            return <Button
                color="error"
                disabled={value}
                endIcon={<CancelIcon color="inherit" fontSize="inherit" />}
                variant="outlined"
                onClick={(): void => {
                    dispatch({
                        type: KeyActionType.revokeKey,
                        payload: key.id,
                    });
                }}
            >Revoke</Button>
        },
        renderChildren(value, prop, key): ReactNode {
            if (!value) {
                return 'No';
            }
            return <>
                Yes
                <CancelIcon color="error" fontSize="inherit" />
                {key.persistedData[prop] !== value ? (
                    <Tooltip title="This value did not sync. That's because there is no real back-end in this demo.">
                        <SyncDisabledIcon color="disabled" />
                    </Tooltip>
                ) : undefined}
            </>;
        }
    },
    expiresAt: {
        name: 'Expires at',
        description: <abbr title="Co-ordinated Universal Time">UTC</abbr>,
        renderChildren(value): ReactNode {
            if (!value) {
                return <Tooltip title="This key never expires">
                    <AllInclusiveIcon fontSize="inherit" />
                </Tooltip>;
            }
            return <>
                {getDateTimeLocal(value, {
                    omitSameDay: true,
                })}
                <EventBusyIcon color="error" fontSize="inherit" />
            </>;
        }
    },
};

interface CardProps extends PropsWithChildren<PropDefaults> {
    actions?: ReactNode;
}

const Card = memo<CardProps>(({ actions, children, description, name }) => {
    return <MuiCard role="row" sx={{  width: '100%' }}>
        <CardHeader
            title={<span role="rowheader">{name}</span>}
            subheader={description}
        />
        <CardContent role="cell">
            <Typography
                sx={{ fontSize: '1.1rem' }}
            >{children}</Typography>
        </CardContent>
        <CardActions>{actions}</CardActions>
    </MuiCard>;
});

export const Property = memo(<P extends keyof ApiKeyExisting,>({apiKey, prop}: Props<P>) => {
    return <Card
        actions={propMap[prop]?.renderActions?.(apiKey[prop], prop, apiKey)}
        description={propMap[prop]?.description}
        name={propMap[prop]?.name}
    >{propMap[prop]?.renderChildren?.(apiKey[prop], prop, apiKey) ?? apiKey[prop]}</Card>;
}, (prev, next): boolean => {
    return prev.prop === next.prop &&
        prev.apiKey[next.prop] === next.apiKey[next.prop];
});