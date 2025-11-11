import { IApiKeyResponse } from "@/app/api-key/apiKey.types";
import { HttpResponse, HttpResponseResolver, PathParams, ResponseResolver } from "msw";

export const successPopulatedResponse: readonly IApiKeyResponse[] = [
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
];

export function success(responses?: readonly IApiKeyResponse[]): HttpResponseResolver<PathParams, undefined, IApiKeyResponse[]> {
    return async function ResolveApiKeysSuccess(info) {
        if (!info.cookies.bearerToken) {
            return unauthorized()(info);
        }
        return HttpResponse.json(
            [...responses ?? successPopulatedResponse]
        );
    }
}

export function unauthorized(): ResponseResolver {
    return function ResolveApiKeysUnauthorized() {
        return new HttpResponse('Forbidden', {
            status: 401,
        });
    };
}