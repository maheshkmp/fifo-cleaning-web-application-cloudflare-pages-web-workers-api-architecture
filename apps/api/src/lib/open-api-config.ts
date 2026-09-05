import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";

import { APIBindings } from "@/types";

import packageJson from "../../package.json";
import { BASE_PATH, IS_PRODUCTION } from "./constants";

export default function configureOpenAPI(
  app: OpenAPIHono<APIBindings>
): OpenAPIHono<APIBindings> {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Bunplate (by CodeVille)"
    }
  });

  app.get(
    "/reference",
    Scalar(() => ({
      url: IS_PRODUCTION ? `/openapi.json` : `${BASE_PATH}/doc`,
      theme: "default"
    }))
  );

  return app;
}
