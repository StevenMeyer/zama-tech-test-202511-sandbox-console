import { Login } from "@/components/login/Login";
import { LogoTopbarItem } from "@/components/topbar/LogoTopbarItem";
import { NavTopbarItem } from "@/components/topbar/NavTopbarItem";
import { SessionTopbarItem } from "@/components/topbar/SessionTopbarItem";
import { Topbar } from "@/components/topbar/Topbar";
import { Container } from "@mui/material";

export default function LoginPage() {
    return <>
        <Topbar
            leftItems={[{ item: <LogoTopbarItem />, key: 'logo' }]}
            rightItems={[
                { item: <SessionTopbarItem />, key: 'session' },
                { item: <NavTopbarItem currentRoute="/login" />, key: 'nav' },
            ]}
        />
        <Container>
            <Login />
        </Container>;
    </>
}
