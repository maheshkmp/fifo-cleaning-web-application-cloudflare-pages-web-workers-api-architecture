import { OpenAPIHono } from "@hono/zod-openapi";
import { APIBindings } from "./types";
export declare function createAPIRouter(): OpenAPIHono<APIBindings>;
export declare function setupAPI(): OpenAPIHono<APIBindings>;
