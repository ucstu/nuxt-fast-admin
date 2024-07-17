import { createNuxtGlobalState, dict } from "#imports";
import {
  type ColumnCompositionProps,
  type CompositionColumns,
  type CrudOptions,
} from "@ucstu/nuxt-fast-crud/exports";
import type { LiteralUnion } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import type { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

interface $Api {
  [key: string]: object;
}

type Schemas =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.SchemaObject
  | OpenAPIV3_1.ReferenceObject;

type ObjectSchema = OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject;

type ResFromSchema<Schema> = Schema extends { properties: infer Res }
  ? Res
  : unknown;

type Reference<
  Api extends $Api,
  Key extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Key]>>
> = {
  /**
   * API
   */
  api?: $Api;
  /**
   * 名称
   */
  name: LiteralUnion<keyof Api & `$${string}`, string>;
  /**
   * 字段
   */
  field: LiteralUnion<keyof Res, string>;
  /**
   * 覆盖
   */
  overrides?: Partial<CrudOptions<any>>;
  /**
   * 类型
   * @default multiple
   */
  type?: "single" | "multiple";
};

interface $CrudOptions<
  Api extends $Api,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Name]>>
> extends CrudOptions<Res> {
  /**
   * 资源名称
   */
  name: string;
  /**
   * 资源引用
   */
  references?: Array<
    LiteralUnion<keyof Res, string> | Reference<Api, Name, Res>
  >;
}

function isReferenceObject(schema: Schemas) {
  return "$ref" in schema;
}

function resolveSchemaObject<Api extends $Api>(
  api: Api,
  schema: Schemas | undefined
): ObjectSchema | undefined {
  if (schema && isReferenceObject(schema)) {
    return resolveSchemaObject(api, api[`$${schema.$ref.split("/").pop()}`]);
  }
  return schema;
}

const useResources = createNuxtGlobalState(() => {
  return new Map<$Api, Map<string, $CrudOptions<any, any, any>>>();
});

export function registerCrud<
  Api extends $Api,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Name]>>
>(api: Api, name: Name, options?: Partial<$CrudOptions<Api, Name, Res>>) {
  const resources = useResources();

  const schema = resolveSchemaObject(api, api[name]);

  if (!schema) {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 不存在，无法生成 CRUD`
    );
    return options || {};
  }

  const type = [schema.type].flat()[0];
  if (type !== "object") {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 显示其非对象，无法生成 CRUD`
    );
    return options || {};
  }

  if (!schema.properties) {
    console.warn(
      `[fast-admin] CRUD 资源 ${name.toString()} 的 Schema 显示其没有 properties，无法生成 CRUD`
    );
    return options || {};
  }

  if (!resources.has(api)) {
    resources.set(api, new Map());
  }
  const map = resources.get(api)!;
  if (map.has(name)) {
    console.warn(`[fast-admin] CRUD 资源 ${name.toString()} 已经注册过了`);
    return;
  }
  map.set(
    name,
    defu<$CrudOptions<Api, Name, Res>, Array<$CrudOptions<Api, Name, Res>>>(
      options,
      {
        name,
        columns: Object.fromEntries(
          (Object.entries(schema.properties) as Array<[keyof Res, Schemas]>)
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
              }
            )
            .filter((item) => item !== undefined)
        ) as CompositionColumns<Res>,
      }
    )
  );
}

function normalizeReferences<
  Api extends $Api,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Name]>>
>(
  api: Api,
  references: Array<LiteralUnion<keyof Res, string> | Reference<Api, Name, Res>>
) {
  return references.map((reference) => {
    if (typeof reference !== "object") {
      return {
        api,
        name: reference.toString(),
        field: reference,
        type: "multiple",
      };
    }
    return {
      ...reference,
      api: reference.api ?? api,
      type: reference.type ?? "multiple",
    };
  }) as Array<Reference<Api, Name, Res>>;
}

function referencesToColumns<
  Api extends $Api,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Name]>>
>(
  api: Api,
  references: Array<LiteralUnion<keyof Res, string> | Reference<Api, Name, Res>>
) {
  return normalizeReferences(api, references).reduce((columns, reference) => {
    columns[reference.field] = {
      type: "table-select",
      dict: dict({}),
      form: {
        component: {
          props: {
            multiple: reference.type === "multiple",
            createCrudOptions() {
              return useAdminCrud(api, reference.name as any);
            },
            crudOptionsOverride: reference.overrides,
          },
        },
      },
    };
    return columns;
  }, {} as CompositionColumns<any>) as CompositionColumns<Res>;
}
