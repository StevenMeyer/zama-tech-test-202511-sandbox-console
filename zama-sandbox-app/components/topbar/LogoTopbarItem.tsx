import { Link } from "@mui/material";
import Image from "next/image";
import { FC, memo } from "react";

export const LogoTopbarItem: FC = memo(() => {
    return <Link href="https://www.zama.org/" rel="external noopener noreferrer">
        <Image
            alt="Logo"
            height={30}
            src="/logo.svg"
            width={74}
        />
    </Link>
});
