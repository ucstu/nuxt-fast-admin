import { createNuxtGlobalState, dict } from "#imports";
import {
  type ColumnCompositionProps,
  type CompositionColumns,
} from "@ucstu/nuxt-fast-crud/exports";
import defu from "defu";
import type {
  $CrudOptions,
  CrudApi,
  CrudObjectSchema,
  CrudResFromSchema,
  CrudSchemas,
} from "../types";

export const useResources = createNuxtGlobalState(function () {
  return new Map<CrudApi, Map<string, $CrudOptions<any, any, any>>>();
});

function resolveSchemaObject<Api extends CrudApi>(
  api: Api,
  schema: CrudSchemas | undefined,
): CrudObjectSchema | undefined {
  if (schema && "$ref" in schema) {
    return resolveSchemaObject(api, api[`$${schema.$ref.split("/").pop()}`]);
  }
  return schema;
}

export function regAdminCrud<
  Api extends CrudApi,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Name]>>,
  Ret extends $CrudOptions<Api, Name, Res>,
>(api: Api, name: Name, options: Partial<Ret> = {}): Ret {
  const resources = useResources();

  const schema = resolveSchemaObject(api, api[name]);

  if (!schema) {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 不存在，无法生成 CRUD`,
    );
    return options as Ret;
  }

  const type = [schema.type].flat()[0];
  if (type !== "object") {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 显示其非对象，无法生成 CRUD`,
    );
    return options as Ret;
  }

  if (!schema.properties) {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 显示其没有 properties，无法生成 CRUD`,
    );
    return options as Ret;
  }

  let map = resources.get(api);
  if (!map) {
    map = new Map();
    resources.set(api, map);
  }

  if (map.has(name)) {
    console.warn(`[fast-admin] CRUD 资源 ${name.toString()} 已经注册过了`);
    return map.get(name) as Ret;
  }

  map.set(
    name,
    defu<$CrudOptions<Api, Name, Res>, Array<$CrudOptions<Api, Name, Res>>>(
      options,
      {
        name,
        columns: Object.fromEntries(
          (Object.entries(schema.properties) as Array<[keyof Res, CrudSchemas]>)
            .map(
              ([key, value]):
                | [keyof Res, ColumnCompositionProps<Res>]
                | undefined => {
                const schema = resolveSchemaObject(api, value);
                const required =
                  schema?.required?.includes(key.toString()) || false;

                if (!schema) {
                  return [
                    key,
                    {
                      type: "text",
                      title: key.toString(),
                      form: { rules: [{ required }] },
                    },
                  ];
                }

                const type = [schema.type].flat()[0];

                switch (type) {
                  case "string":
                  case "number":
                  case "integer":
                    return [
                      key,
                      {
                        type: schema.enum
                          ? "dict-select"
                          : type === "string"
                            ? "text"
                            : "number",
                        title: key.toString(),
                        form: {
                          rules: [
                            {
                              required,
                              type: schema.enum ? "enum" : type,
                              min: schema.minLength,
                              max: schema.maxLength,
                              pattern: schema.pattern,
                              enum: schema.enum,
                            },
                          ],
                        },
                        dict: schema.enum
                          ? dict({
                              data: schema.enum.map((value) => ({
                                label: value,
                                value,
                              })),
                            })
                          : undefined,
                      },
                    ];
                  case "boolean":
                    return [
                      key,
                      {
                        type: "dict-switch",
                        title: key.toString(),
                        form: {
                          rules: [
                            {
                              required,
                              type: schema.enum ? "enum" : type,
                              enum: schema.enum,
                            },
                          ],
                        },
                      },
                    ];
                  case "array":
                    return [
                      key,
                      {
                        type: "array",
                        title: key.toString(),
                      },
                    ];
                  default:
                    return undefined;
                }
              },
            )
            .filter((item) => item !== undefined),
        ) as CompositionColumns<Res>,
      },
    ),
  );

  return map.get(name) as Ret;
}
