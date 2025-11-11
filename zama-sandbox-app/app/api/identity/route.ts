import 'server-only';
import { cookies } from 'next/headers';
import { v4 } from '../../utils/uuid';

export async function POST(request: Request): Promise<Response> {
    const [formData, cookieStore] = await Promise.all([
        request.formData(),
        cookies(),
    ]);
    cookieStore.delete('bearerToken');
    const id = formData.get('id');
    const password = formData.get('password');
    if (!id || !password || typeof id !== 'string' || typeof password !== 'string' || id.trim() === '') {
        return new Response('Forbidden', {
            status: 401,
        });
    }
    if (id === 'test@example.com' && password === 'password1') {
        cookieStore.set('bearerToken', v4()); // should be a JWT, but this is not real
        return new Response(JSON.stringify({
            id: '89f998cf-29a7-4e83-bfc3-b2e863150700',
            displayName: 'Test User',
        }), {
            headers: new Headers({
                'content-type': 'application/json',
            }),
            status: 200,
        });
    }
    return  new Response('Forbidden', {
        status: 401,
    });
}