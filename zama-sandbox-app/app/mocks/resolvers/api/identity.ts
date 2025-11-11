import { User } from "@/app/user/user"
import { v4 } from "@/app/utils/uuid";
import { DefaultBodyType, DefaultRequestMultipartBody, HttpResponse, HttpResponseResolver, PathParams, ResponseResolver } from "msw"

/**
 * Makes a success resolver, but the resolver will still return a 401 for empty credentials
 * @param [overrides] Optional override data for the returned User JSON
 */
export function success(overrides?: Partial<User> & { bearerToken?: string }): HttpResponseResolver<PathParams, DefaultRequestMultipartBody, User | 'Forbidden'> {
    return async function ResolveIdentitySuccess(info) {
        const formData = await info.request.formData();
        const id = formData.get('id');
        const password = formData.get('password');

        if (!id || typeof id !== 'string' || !password || typeof password !== 'string') {
            return unauthorized()(info);
        }

        return successWithoutFormData({
            id,
            ...overrides,
        })(info);
    };
}

export function successWithoutFormData(overrides?: Partial<User> & { bearerToken?: string }): HttpResponseResolver<PathParams, DefaultRequestMultipartBody, User | 'Forbidden'> {
    return async function ResolveIdentitySuccess() {
        return HttpResponse.json({
            id: overrides?.id ?? 'test@example.com',
            displayName: overrides?.displayName ?? 'Test User',
        }, {
            headers: {
                'set-cookie': `bearerToken=${overrides?.bearerToken ?? v4()}`,  // would be a JWT, but it doesn't matter since we're intercepting everything
            },
        });
    };
}

export function unauthorized(): HttpResponseResolver<PathParams, DefaultBodyType, 'Forbidden'> {
    return function ResolveIdentityUnauthorized() {
        return new HttpResponse('Forbidden', {
            status: 401,
        });
    };
}