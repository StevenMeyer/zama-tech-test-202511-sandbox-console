import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { Example } from "@/components/docs/Example";
import { NewKeyForm } from "@/components/newKey/NewKeyForm";
import { CodeCopy } from "@/components/docs/CodeCopy";
import { Property } from "@/components/key/Property";
import { ApiKey } from "@/lib/key/key";
import { Topbar } from "@/components/topbar/Topbar";
import { LogoTopbarItem } from "@/components/topbar/LogoTopbarItem";
import { NavTopbarItem } from "@/components/topbar/NavTopbarItem";
import { SessionTopbarItem } from "@/components/topbar/SessionTopbarItem";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function DocsPage() {
    return <>
        <Topbar
            leftItems={[{ item: <LogoTopbarItem />, key: 'logo' }]}
            rightItems={[
                { item: <SessionTopbarItem />, key: 'session' },
                { item: <NavTopbarItem currentRoute="/docs" />, key: 'nav' },
            ]}
        />
        <Box sx={{ backgroundColor: 'primary.main', px: 3, py: 6 }}>
            <Typography variant="h1">Docs</Typography>
            <Typography component="h2" variant="h3">Table of contents</Typography>
            <ol>
                <li><Link href='#generateAKey' color="secondary">Generate a key</Link></li>
                <li><Link href="#useAKey" color="secondary">Use a key</Link></li>
                <li><Link href="#revokeAKey" color="secondary">Revoke a key</Link></li>
            </ol>
        </Box>
        <Container>
            <Box id="generateAKey" sx={{ my: 2 }}>
                <Typography variant="h2">Generate a key</Typography>
                <Typography>To generate a new key you need the following information:</Typography>
                <ul>
                    <li>A human-readable name for the key. This is so you can recognise it.</li>
                    <li>Decide whether and when the key will expire.</li>
                </ul>
                <Typography>If a key never expires it can be used to access the API <em>forever</em>, unless the key is revoked.</Typography>
                <Typography>If a key has an expiry date (and time) it will not allow access to the API from that time. Revoking an expired key has no effect.</Typography>
                <Typography sx={{ mb: 1 }}>To begin, from the <Link href="/">dashboard</Link>, click the big <AddIcon aria-label="Add icon" fontSize="inherit" /> button:</Typography>
                <Example description="An example of the floating action button to start creating a key">
                    <Fab
                        aria-readonly
                        color="primary"
                        sx={{ mb: 2 }}
                    ><AddIcon /></Fab>
                </Example>
                <Typography>Fill out the name and either enter a future expiry date or check the "Key never expires" checkbox:</Typography>
                <Example
                    description="The form to fill in the key name and choose an expiry date"
                    scale={0.7}
                >
                    <NewKeyForm />
                </Example>
            </Box>
            <Box id="useAKey" sx={{ my: 2 }}>
                <Typography variant="h2">Use an API key</Typography>
                <Typography>Use <b>HTTPS</b> to send and receive data to/from the APIs.</Typography>
                <Typography>To use a restricted API you must use an API key to authenticate your requests. This is done with the <b>Authorization</b> request header.</Typography>
                <Typography>The standard header looks like:<br /><code>Autorization: Apikey 76c94af1-7b3c-446f-b7e9-f8c291543293</code></Typography>
                <Typography>To use your API key with curl:</Typography>
                <CodeCopy lines={[
                    'curl -H "Authorization: ApiKey 76c94af1-7b3c-446f-b7e9-f8c291543293" https://api.example.org'
                ]} />
                <Typography sx={{ mt: 2 }}>or wget:</Typography>
                <CodeCopy lines={[
                    'wget --header="Authorization: ApiKey 76c94af1-7b3c-446f-b7e9-f8c291543293" https://api.example.org'
                ]} />
            </Box>
            <Box id="revokeAKey" sx={{ mt: 2 }}>
                <Typography variant="h2">Revoke a key</Typography>
                <Typography>You can stop a key from being used to access to API immediately at any time.</Typography>
                <Typography>Revoking an expired key has no effect: the key stopped working when it expired.</Typography>
                <Typography>To revoke a key:</Typography>
                <ol>
                    <li>From the <Link href="/">dashboard</Link>, click on the row in the table containing the key you wish to revoke.</li>
                    <li>
                        In the Revoke card, the Revoke <CancelIcon aria-label="Revoke icon" fontSize="inherit" /> button can be clicked if the key can be revoked.
                        <Box sx={{ maxWidth: '250px' }}>
                            <Example
                                description="The revoke card"
                                scale={0.7}
                            >
                                <Property apiKey={{ isRevoked: false } as ApiKey} prop="isRevoked" />
                            </Example>
                        </Box>
                    </li>
                </ol>
            </Box>
        </Container>
    </>;
}