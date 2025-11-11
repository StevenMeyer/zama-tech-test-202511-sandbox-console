import { ApiKey } from "@/app/api-key/apiKey";
import { verifySession } from "@/app/lib/dal";
import { v4 } from "@/app/utils/uuid";

export async function GET(): Promise<Response> {
    const session = await verifySession();
    if (!session?.isAuth) {
        return new Response(null, {
            status: 401,
        });
    }

    return new Response(JSON.stringify([
        {
            id: '3c622ee8-c067-41f9-a7ea-afe286e1794a',
            name: 'Node key',
            maskedKey: '********-****-****-****-******427d0d',
            createdAt: '2025-11-01T14:54:24.562Z',
            isRevoked: false,
        },
        {
            id: '20249e87-bd43-44d6-9d38-1cdc61f3dce2',
            name: 'Key for Xmas contractors',
            maskedKey: '********-****-****-****-******1effff',
            createdAt: '2024-12-04T10:08:55.348Z',
            expiresAt: '2025-01-01T00:00:00.000Z',
            isRevoked: false,
        },
        {
            id: '136acb44-1da9-4e7b-9813-933ef19ddab1',
            name: 'James\'s API key',
            maskedKey: '********-****-****-****-******031d81',
            createdAt: '2025-10-31T09:11:35.348Z',
            updatedAt: '2025-11-01T10:00:41.982Z',
            isRevoked: true,
        },
    ]), {
        headers: new Headers({
            'content-type': 'application/json',
        }),
    })
}

export async function POST(request: Request): Promise<Response> {
    const session = await verifySession();
    if (!session?.isAuth) {
        return new Response(null, {
            status: 401,
        });
    }

    const keyData = await request.json();
    // TODO check expiresAt date isn't in the past
    const key = v4();
    return new Response(JSON.stringify({
        ...keyData,
        id: v4(),
        key,
        maskedKey: `********-****-****-****-******${key.substring(key.length - 6)}`,
        createdAt: new Date().toISOString(),
        isRevoked: false,
    }), {
        headers: new Headers({
            'content-type': 'application/json',
        }),
    });
}
