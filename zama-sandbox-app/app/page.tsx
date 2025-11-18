import Container from "@mui/material/Container";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getKeys, verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/topbar/Topbar";
import { SessionTopbarItem } from "@/components/topbar/SessionTopbarItem";
import { LogoTopbarItem } from "@/components/topbar/LogoTopbarItem";
import { NavTopbarItem } from "@/components/topbar/NavTopbarItem";

export default async function HomePage() {
  const session = await verifySession();
  if (!session.isAuth) {
    redirect('/login');
  }
  const keys = await getKeys();
  return <>
    <Topbar
      leftItems={[{ item: <LogoTopbarItem />, key: 'logo' }]}
      rightItems={[
        { item: <SessionTopbarItem />, key: 'session' },
        { item: <NavTopbarItem currentRoute="/" />, key: 'nav' },
      ]}
    />
    <Container>
      <Dashboard
        keys={keys}
      />
    </Container>
  </>;
}
