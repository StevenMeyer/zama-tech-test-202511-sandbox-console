import { ApiKeyExisting } from "@/lib/key/key";
import { Box, Modal, ModalProps } from "@mui/material";
import { FC } from "react";
import { NewKey } from "../newKey/NewKey";

interface Props extends Pick<ModalProps, 'open' | 'onClose'> {
    onKeyCreated?(key: ApiKeyExisting): void;
}

export const NewKeyModal: FC<Props> = ({ onClose, onKeyCreated, open }) => {
    return <Modal
        aria-label="Create a new API key"
        open={open}
        onClose={onClose}
    >
        <Box>
            <NewKey onKeyCreated={onKeyCreated} />
        </Box>
    </Modal>
};
