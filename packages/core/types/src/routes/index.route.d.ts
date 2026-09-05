declare const router: import("@hono/zod-openapi").OpenAPIHono<import("../types").APIBindings, {
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
}, "/">;
export default router;
