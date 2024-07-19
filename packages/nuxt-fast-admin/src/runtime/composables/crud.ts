import { dict } from "#imports";
import type { CompositionColumns } from "@ucstu/nuxt-fast-crud/exports";
import { reactify, type LiteralUnion } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { cloneDeep } from "lodash-es";
import type {
  $CrudOptions,
  CrudApi,
  CrudReference,
  CrudResFromSchema,
} from "../types";
import { useResources } from "../utils";

export function normalizeReferences<
  Api extends CrudApi,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Name]>>,
>(
  api: Api,
  references: Array<
    LiteralUnion<keyof Res, string> | CrudReference<Api, Name, Res>
  >,
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
  }) as Array<CrudReference<Api, Name, Res>>;
}

export function referencesToColumns<
  Api extends CrudApi,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Name]>>,
>(
  api: Api,
  references: Array<
    LiteralUnion<keyof Res, string> | CrudReference<Api, Name, Res>
  >,
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
              return getAdminCrud(api, reference.name as any);
            },
            crudOptionsOverride: reference.overrides,
          },
        },
      },
    };
    return columns;
  }, {} as CompositionColumns<any>) as CompositionColumns<Res>;
}

export function getAdminCrud<
  Api extends CrudApi,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<CrudResFromSchema<Api[Name]>>,
  Ret extends $CrudOptions<Api, Name, Res>,
>(api: Api, name: Name, options: Partial<Ret> = {}): Ret {
  const resources = useResources();
  const res = cloneDeep(resources.get(api)?.get(name));
  if (!res) {
    console.warn(`[fast-admin] CRUD 资源 ${name.toString()} 未进行注册`);
    return defu(options, {
      columns: referencesToColumns(api, options?.references ?? []),
    }) as Ret;
  }

  return defu(
    options,
    {
      columns: referencesToColumns(api, options?.references ?? []),
    },
    {
      columns: referencesToColumns(api, res.references ?? []),
    },
    res,
  ) as Ret;
}

export const useAdminCrud = reactify(getAdminCrud);
