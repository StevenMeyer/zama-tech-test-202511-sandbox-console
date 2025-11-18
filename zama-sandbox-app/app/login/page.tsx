import { Login } from "@/components/login/Login";
import { LogoTopbarItem } from "@/components/topbar/LogoTopbarItem";
import { NavTopbarItem } from "@/components/topbar/NavTopbarItem";
import { Topbar } from "@/components/topbar/Topbar";
import Container from "@mui/material/Container";

export default function LoginPage() {
    return <>
        <Topbar
            leftItems={[{ item: <LogoTopbarItem />, key: 'logo' }]}
            rightItems={[
                { item: <NavTopbarItem currentRoute="/login" />, key: 'nav' },
            ]}
        />
        <Container>
            <Login />
        </Container>;
    </>
}
