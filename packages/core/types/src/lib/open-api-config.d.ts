import { OpenAPIHono } from "@hono/zod-openapi";
import { APIBindings } from "./types";
export default function configureOpenAPI(app: OpenAPIHono<APIBindings>): OpenAPIHono<APIBindings>;
