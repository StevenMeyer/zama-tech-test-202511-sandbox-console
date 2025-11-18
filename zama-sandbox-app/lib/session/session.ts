import 'server-only';
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

export const sessionCookieName = 'bearerToken';

export async function createSession(): Promise<void> {
    const cookieStore = await cookies();
    // in reality we'd use a JWT with proper session data
    cookieStore.set(sessionCookieName, uuid(), {
        httpOnly: true,
        maxAge: 60 * 60, // 1 hr just for the demo
        path: '/',
        sameSite: 'lax',
    });
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(sessionCookieName);
}