import { http, HttpHandler } from "msw";
import { success } from "../../resolvers/api/key";

export const handlers: readonly HttpHandler[] = [
    http.get('/api/key', success()),
];
