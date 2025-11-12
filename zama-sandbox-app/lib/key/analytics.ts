export interface ApiKeyAnalytics {
    readonly keyId: string;
    requestCounts: {
        daily: number[];
        weekly: number[];
        monthly: number[];
    };
}