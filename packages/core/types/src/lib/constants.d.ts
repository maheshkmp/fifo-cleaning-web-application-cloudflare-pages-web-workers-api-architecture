export declare const BASE_PATH: "/api";
export declare const IS_PRODUCTION: boolean;
export declare const ZOD_ERROR_MESSAGES: {
    REQUIRED: string;
    EXPECTED_NUMBER: string;
    NO_UPDATES: string;
};
export declare const ZOD_ERROR_CODES: {
    INVALID_UPDATES: string;
};
export declare const notFoundSchema: import("zod").ZodObject<{
    message: import("zod").ZodString;
}, import("better-auth").$strip>;
