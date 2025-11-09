import { User } from "@/app/user/user"
import { v4 } from "@/app/utils/uuid";
import { DefaultBodyType, DefaultRequestMultipartBody, HttpResponse, ResponseResolver } from "msw"

/**
 * Makes a success resolver, but the resolver will still return a 401 for empty credentials
 * @param [overrides] Optional override data for the returned User JSON
 */
export function success(overrides?: Partial<User>): ResponseResolver<Record<string, unknown>, DefaultRequestMultipartBody, User> {
    return async function ResolveIdentitySuccess(info) {
        const formData = await info.request.formData();
        const id = formData.get('id');
        const password = formData.get('password');

        if (!id || typeof id !== 'string' || !password || typeof password !== 'string') {
            return forbidden()(info);
        }

        return HttpResponse.json({
            id: overrides?.id ?? id ?? 'test@example.com',
            displayName: overrides?.displayName ?? 'Test User',
            token: overrides?.token ?? v4(), // would be a JWT, but it doesn't matter since we're intercepting everything
        });
    };
}

export function forbidden(): ResponseResolver {
    return function ResolveIdentityForbidden() {
        return new HttpResponse('Forbidden', {
            status: 401,
        });
    };
}