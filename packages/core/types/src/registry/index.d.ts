import { OpenAPI } from "./types";
export declare function registerRoutes(app: OpenAPI): import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{}, "/api"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export declare const router: import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{}, "/api"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export type Router = typeof router;
