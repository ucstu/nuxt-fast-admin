import type { OpenFetchClient } from "#imports";
import type { CrudOptions } from "@ucstu/nuxt-fast-crud/exports";
import { reactify } from "@ucstu/nuxt-fast-utils/exports";
import defu from "defu";
import { cloneDeep } from "lodash-es";

export const useCrudOptions = createNuxtGlobalState(() => {
  const crudOptions = new WeakMap<
    OpenFetchClient<unknown>,
    Map<string, CrudOptions<unknown>>
  >();

  function value(api: OpenFetchClient<unknown>) {
    return crudOptions.get(api);
  }

  function has(api: OpenFetchClient<unknown>, resource: string) {
    return crudOptions.has(api) && crudOptions.get(api)!.has(resource);
  }

  function set(
    api: OpenFetchClient<unknown>,
    resource: string,
    options: CrudOptions<unknown>
  ) {
    if (!crudOptions.has(api)) {
      crudOptions.set(api, new Map());
    }
    crudOptions.get(api)!.set(resource, options);
  }

  function get(
    api: OpenFetchClient<unknown>,
    resource: string,
    override?: CrudOptions<unknown>
  ) {
    if (!crudOptions.has(api)) {
      return undefined;
    }
    if (!crudOptions.get(api)!.has(resource)) {
      return cloneDeep(override);
    }
    return cloneDeep(defu(crudOptions.get(api)!.get(resource)!, override));
  }

  const use = reactify(get);

  return {
    has,
    get,
    set,
    use,
    value,
  };
});
