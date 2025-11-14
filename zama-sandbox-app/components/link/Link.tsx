import NextLink, { LinkProps } from "next/link";
import { forwardRef } from "react";

/**
 * Don't use this Link directly, as <Link />.
 * Instead it is meant to be used in the Theme, or in a component prop.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
    return <NextLink ref={ref} {...props} />;
});
