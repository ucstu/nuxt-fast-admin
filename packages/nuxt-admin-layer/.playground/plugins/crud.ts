/* eslint-disable @typescript-eslint/no-explicit-any */
import { FsExtendsJson } from "@fast-crud/fast-extends";
import type {
  ColumnCompositionProps,
  CrudOptions,
  ValueBuilderContext,
  ValueResolveContext,
} from "@ucstu/nuxt-fast-crud/exports";
import defu from "defu";
import type {
  OpenAPIObject,
  OperationObject,
  ReferenceObject,
  SchemaObject,
} from "openapi3-ts/oas31";

import type { OpenFetchClient } from "#imports";
import "@fast-crud/fast-extends/dist/style.css";
import type { Item } from "spring-filter-query-builder/dist/types";

type Methods =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

function resolveSchemaObject(
  doc: OpenAPIObject,
  schema: SchemaObject | ReferenceObject | undefined
) {
  if (schema && "$ref" in schema) {
    const ref = schema.$ref;
    const [name] = ref.split("/").slice(-1);
    const resolved = doc.components?.schemas?.[name];
    if (resolved && "$ref" in resolved) {
      return resolveSchemaObject(doc, resolved);
    }
    return resolved;
  }
  return schema;
}

const AutoColumns = ["id", "createdBy", "createdAt", "updatedBy", "updatedAt"];

function resolveColumnCompositionProps(
  doc: OpenAPIObject,
  schema: SchemaObject | ReferenceObject | undefined,
  key: string
): ColumnCompositionProps<unknown> {
  const resolved = resolveSchemaObject(doc, schema);
  if (!resolved) {
    return {
      schema,
      title: key,
      type: "text",
    };
  }

  return defu<
    ColumnCompositionProps<unknown>,
    Array<ColumnCompositionProps<unknown>>
  >(
    {
      schema,
      title: resolved.description,
      sortable: true,
    },
    AutoColumns.includes(key)
      ? {
          column: { show: false },
          search: { show: false },
          addForm: { show: false },
          editForm: { component: { disabled: true } },
        }
      : {},
    resolveColumnTypeProps(resolved),
    { column: { sorter: "custom" } }
  );
}

function resolveColumnTypeProps(
  schema: SchemaObject
): ColumnCompositionProps<unknown> {
  switch (schema.type) {
    case "array":
    case "object":
      return {
        type: "text",
        column: { show: false },
        form: { component: { name: "fs-json-editor" } },
      };
    case "boolean":
      return {
        type: "dict-switch",
        search: { show: true },
        dict: dict({
          data: [
            { label: "是", value: true },
            { label: "否", value: false },
          ],
        }),
      };
    case "integer":
      return {
        type: "number",
        search: { show: true },
        form: {
          component: {
            props: {
              precision: 0,
            },
          },
        },
      };
    case "number":
      return {
        type: "number",
        search: { show: true },
      };
    case "string":
      if (schema.enum) {
        const descriptions = schema["x-enum-descriptions"];
        return {
          type: "dict-select",
          search: { show: true },
          dict: dict({
            data: schema.enum.map((value, index) => ({
              label: descriptions?.[index] ?? value,
              value,
            })),
          }),
        };
      }
      break;
    default:
      return {
        type: "text",
        search: { show: true },
      };
  }
}

export default defineNuxtPlugin({
  name: "crud",
  enforce: "pre",
  async setup() {
    const nuxtApp = useNuxtApp();
    const resources = useCrudOptions();
    const config = useRuntimeConfig().public.openFetch;

    nuxtApp.vueApp.use(FsExtendsJson);

    try {
      const doc = await $fetch<OpenAPIObject>(
        config.fims.baseURL + "/v3/api-docs"
      );

      const api = nuxtApp.$fims as OpenFetchClient<any>;

      for (const [path, item] of Object.entries(doc.paths ?? {})) {
        const operations = (
          [
            ["delete", item.delete],
            ["get", item.get],
            ["head", item.head],
            ["options", item.options],
            ["patch", item.patch],
            ["post", item.post],
            ["put", item.put],
            ["trace", item.trace],
          ] as Array<[Methods, OperationObject]>
        ).filter((operation) => operation[1] !== undefined);
        for (const [method, operation] of operations) {
          if ("x-crud-resource" in operation) {
            const resource =
              resources.get(api, operation["x-crud-resource"]) ?? {};
            resource.request ??= {};
            switch (operation["x-crud-operation"]) {
              case "create":
                resource.request.addRequest = async ({ form }) => {
                  return await api(path, {
                    method: method,
                    body: form as any,
                  });
                };
                break;
              case "remove":
                resource.request.delRequest = async ({ row }) => {
                  return await api(path.replace("{id}", (row as any).id), {
                    method: method,
                  });
                };
                break;
              case "update":
                resource.request.editRequest = async ({ row, form }) => {
                  return await api(path.replace("{id}", (row as any).id), {
                    method: method,
                    body: form as any,
                  });
                };
                break;
              case "get":
                resource.request.infoRequest = async ({ row }) => {
                  if (!row) return;
                  return await api(path.replace("{id}", (row as any).id), {
                    method: method,
                  });
                };
                break;
              case "query":
                resource.request.pageRequest = async ({
                  page,
                  filter,
                  sort,
                }) => {
                  return await api(path, {
                    method: method,
                    query: defu(
                      {
                        filter: filter?.toString(),
                        page: page.currentPage - 1,
                        size: page.pageSize,
                      },
                      Object.keys(sort ?? {}).length > 0
                        ? {
                            sort: `${sort.prop},${sort.asc ? "asc" : "desc"}`,
                          }
                        : undefined
                    ),
                  });
                };
                resource.request.transformQuery = ({ page, form, sort }) => {
                  const items: Item[] = [];
                  for (const [key, value] of Object.entries(form ?? {})) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const column = resource.columns?.[
                      key
                    ] as ColumnCompositionProps<unknown>;
                    if (column) {
                      switch (column.type) {
                        case "text":
                        case "textarea":
                          items.push(sfLike(key, `*${value}*`));
                          break;
                        case "number":
                        case "dict-radio":
                        case "dict-select":
                        case "dict-switch":
                        case "dict-checkbox":
                          items.push(
                            Array.isArray(value)
                              ? sfIn(key, value)
                              : sfEqual(key, value)
                          );
                          break;
                        case "time":
                        case "date":
                        case "datetime":
                          items.push(
                            Array.isArray(value)
                              ? sfAnd([
                                  sfGe(key, value[0]),
                                  sfLe(key, value[1]),
                                ])
                              : sfEqual(key, value)
                          );
                          break;
                        default:
                          break;
                      }
                    }
                  }
                  return {
                    page,
                    filter: items.length ? sfAnd(items) : undefined,
                    sort,
                  };
                };
                resource.request.transformRes = ({ res }) => {
                  if (
                    "content" in res &&
                    "page" in res &&
                    res.page instanceof Object &&
                    "number" in res.page &&
                    "size" in res.page &&
                    "totalElements" in res.page
                  ) {
                    return {
                      currentPage: Number(res.page.number) + 1,
                      pageSize: res.page.size,
                      total: res.page.totalElements,
                      records: res.content,
                    };
                  }
                  return res as any;
                };
                break;
              default:
                break;
            }

            const schema = resolveSchemaObject(
              doc,
              doc.components?.schemas?.[operation["x-crud-resource"]]
            );
            if (schema) {
              resource.description = schema.description;
              resource.columns = defu(
                resource.columns ?? {},
                Object.fromEntries(
                  Object.entries(schema.properties ?? {}).map(
                    ([key, value]) => [
                      key,
                      resolveColumnCompositionProps(doc, value, key),
                    ]
                  )
                )
              );
            }

            resources.set(api, operation["x-crud-resource"], resource);
          }
        }
      }
      nuxtApp.hook("fast-admin:get-crud-options", (api, resource, result) => {
        result.value ??= {};
        if (resources.has(api, resource)) {
          result.value = defu(result.value, resources.get(api, resource));
          for (const [key, value] of Object.entries(
            result.value.columns ?? {}
          )) {
            const schema = (value as any).schema as
              | SchemaObject
              | ReferenceObject;

            const resource = resources.get(
              api,
              "$ref" in schema
                ? schema.$ref.split("/").slice(-1)[0]
                : schema.type === "array" &&
                  schema.items &&
                  "$ref" in schema.items
                ? schema.items.$ref.split("/").slice(-1)[0]
                : "undefined"
            );

            if (resource) {
              const multiple = !("$ref" in schema) && schema.type === "array";
              const valueBuilder = ({
                row,
                form,
                key,
                value,
              }: ValueBuilderContext<unknown>) => {
                if (!value) return;
                if (multiple) {
                  (row as any)[key] = value.map((item: any) => item.id);
                  (form as any)[key] = value.map((item: any) => item.id);
                } else {
                  (row as any)[key] = value.id;
                  (form as any)[key] = value.id;
                }
              };
              const valueResolve = ({
                form,
                key,
                value,
              }: ValueResolveContext<unknown>) => {
                if (!value) return;
                if (multiple) {
                  (form as any)[key] = value.map((item: any) => ({
                    id: item,
                  }));
                } else {
                  (form as any)[key] = {
                    id: value,
                  };
                }
              };
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              result.value.columns[key] = defu<
                ColumnCompositionProps<unknown>,
                Array<ColumnCompositionProps<unknown>>
              >(
                {
                  type: "table-select",
                  dict: dict({
                    value: "id",
                    label:
                      Object.keys(resource.columns ?? {}).find((key) =>
                        ["name", "title", "code"].includes(key)
                      ) ?? "id",
                    getNodesByValues: async (values: any[]) => {
                      return (
                        (
                          await resource.request?.pageRequest?.({
                            filter: sfIn("id", values),
                            page: {
                              currentPage: 1,
                              pageSize: values.length,
                            },
                          })
                        )?.content ?? []
                      );
                    },
                  }),
                  valueBuilder,
                  column: { show: true },
                  form: {
                    component: {
                      multiple,
                      name: "fs-table-select",
                      createCrudOptions() {
                        return {
                          crudOptions: resource,
                        };
                      },
                    },
                    valueBuilder,
                    valueResolve,
                  },
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                result.value.columns[key]
              );

              result.value = defu<
                CrudOptions<unknown>,
                Array<CrudOptions<unknown>>
              >(result.value ?? {}, {
                actionbar: {
                  buttons: {
                    add: {
                      show: $auth(
                        "|",
                        role("developer"),
                        `${schema.description}:add`
                      ),
                    },
                  },
                },
                rowHandle: {
                  buttons: {
                    edit: {
                      show: $auth(
                        "|",
                        role("developer"),
                        `${schema.description}:edit`
                      ),
                    },
                    view: {
                      show: $auth(
                        "|",
                        role("developer"),
                        `${schema.description}:view`
                      ),
                    },
                    remove: {
                      show: $auth(
                        "|",
                        role("developer"),
                        `${schema.description}:remove`
                      ),
                    },
                  },
                },
              });
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        handleError("加载CRUD配置失败！");
      }
    }
  },
});
