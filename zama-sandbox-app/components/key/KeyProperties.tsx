import { ApiKey } from "@/lib/key/key";
import { Box } from "@mui/material";
import { FC } from "react";
import { Property } from "./Property";

interface Props {
    apiKey: ApiKey;
}

export const KeyProperties: FC<Props> = ({ apiKey }) => {
    return <Box>
        <Box>
            <Property apiKey={apiKey} prop="name" />
        </Box>
        <Box>
            <Property apiKey={apiKey} prop="maskedKey" />
        </Box>
        <Box>
            <Property apiKey={apiKey} prop="createdAt" />
        </Box>
        <Box>
            <Property apiKey={apiKey} prop="expiresAt" />
        </Box>
        <Box>
            <Property apiKey={apiKey} prop="isRevoked" />
        </Box>
    </Box>;
};
