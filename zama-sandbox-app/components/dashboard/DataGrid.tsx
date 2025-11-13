import { DataGrid as MuiDataGrid, GridEventListener } from "@mui/x-data-grid";
import { FC, useCallback } from "react";
import { columns } from "./dataGridColumns";
import { ApiKey } from "@/lib/key/key";

interface Props {
    keys: ReadonlyArray<Readonly<ApiKey>>;
    onRowClick?(key: ApiKey): void;
}

export const DataGrid: FC<Props> = ({ keys, onRowClick }) => {
    const handleRowClick: GridEventListener<'rowClick'> = useCallback(({ row }): void => {
        onRowClick?.(row);
    }, [onRowClick]);

    return <MuiDataGrid
        disableRowSelectionOnClick
        columns={columns}
        rows={keys}
        sx={{
            fontFamily: 'var(--font-telegraf)',
            my: 2.5,
        }}
        onRowClick={handleRowClick}
    />;
};
