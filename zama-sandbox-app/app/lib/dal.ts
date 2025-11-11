import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import 'server-only';

export const verifySession = cache(async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('bearerToken')?.value;

    if (!token) {
        redirect('/login');
    }

    return {
        isAuth: true,
    }
});
