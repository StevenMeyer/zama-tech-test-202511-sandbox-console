import { NewKey } from "@/components/newKey/NewKey";
import { LogoTopbarItem } from "@/components/topbar/LogoTopbarItem";
import { NavTopbarItem } from "@/components/topbar/NavTopbarItem";
import { SessionTopbarItem } from "@/components/topbar/SessionTopbarItem";
import { Topbar } from "@/components/topbar/Topbar";
import { Container } from "@mui/material";

export default function NewKeyPage() {
    return <>
        <Topbar
            leftItems={[{ item: <LogoTopbarItem />, key: 'logo' }]}
            rightItems={[
                { item: <SessionTopbarItem />, key: 'session' },
                { item: <NavTopbarItem currentRoute="/key/new" />, key: 'nav' },
            ]}
        />
        <Container>
            <NewKey />
        </Container>
    </>;
}