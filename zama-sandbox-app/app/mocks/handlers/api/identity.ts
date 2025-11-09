import { http, HttpHandler } from "msw";
import { success } from "../../resolvers/api/identity";

export const handlers: readonly HttpHandler[] = [
    http.post('/api/identity', success()),
];
