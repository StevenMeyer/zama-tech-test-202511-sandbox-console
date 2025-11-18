import { ApiKey } from "@/lib/key/key";
import { FC } from "react";
import { Property } from "./Property";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface Props {
    apiKey: ApiKey;
}

export const KeyProperties: FC<Props> = ({ apiKey }) => {
    return <Box>
        <Grid
            container
            aria-label="API key properties"
            role="table"
            spacing={2.5}
        >
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                <Property apiKey={apiKey} prop="name" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} sx={{ display: 'flex' }}>
                <Property apiKey={apiKey} prop="maskedKey" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} sx={{ display: 'flex' }}>
                <Property apiKey={apiKey} prop="createdAt" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} sx={{ display: 'flex' }}>
                <Property apiKey={apiKey} prop="expiresAt" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} sx={{ display: 'flex' }}>
                <Property apiKey={apiKey} prop="isRevoked" />
            </Grid>
        </Grid>
    </Box>;
};
