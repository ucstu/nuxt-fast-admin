import type { NuxtApp } from "#app";
import type {
  AddReq,
  CrudOptions,
  DelReq,
  DynamicType,
  EditReq,
  InfoReq,
  TransformQuery,
  TransformRes,
  UseFsProps,
  UserPageQuery,
  UserPageRes,
} from "@fast-crud/fast-crud";
import { useIntervalFn } from "@vueuse/core";
import defu from "defu";
import type { PublicRuntimeConfig } from "nuxt/schema";

interface Request<R, F extends keyof PublicRuntimeConfig["openFetch"]> {
  transformQuery?: TransformQuery<R>;
  transformRes?: TransformRes<R>;
  pageRequest?: (
    query: UserPageQuery<R>,
    fetch: NuxtApp[`$${F}`],
  ) => Promise<UserPageRes<R>>;
  addRequest?: (req: AddReq<R>, fetch: NuxtApp[`$${F}`]) => Promise<any>;
  editRequest?: (req: EditReq<R>, fetch: NuxtApp[`$${F}`]) => Promise<any>;
  delRequest?: (req: DelReq<R>, fetch: NuxtApp[`$${F}`]) => Promise<any>;
  infoRequest?: (req: InfoReq<R>, fetch: NuxtApp[`$${F}`]) => Promise<any>;
  [key: string]: any;
}

interface Options<R, F extends keyof PublicRuntimeConfig["openFetch"]>
  extends DynamicType<CrudOptions<R>, R> {
  /**
   * 请求
   */
  request?: Request<R, F>;
  /**
   * 自动请求
   * @description 是否自动请求
   * @default true
   */
  autoFetch?: boolean;
  /**
   * 刷新间隔
   */
  refreshInterval?: number;
}

export function useFaCrud<
  F extends keyof PublicRuntimeConfig["openFetch"],
  R,
  C,
>(
  client: F,
  options: Options<R, F>,
  props?: Omit<UseFsProps<R, C>, "createCrudOptions">,
) {
  const nuxtApp = useNuxtApp();
  const results = useFs(
    defu<UseFsProps<R, C>, [UseFsProps<R, C>]>(props, {
      createCrudOptions() {
        return {
          crudOptions: defu<
            DynamicType<CrudOptions<R>, R>,
            Array<DynamicType<CrudOptions<R>, R>>
          >(
            { ...options, request: undefined },
            {
              request: {
                ...options.request,
                pageRequest: options.request?.pageRequest
                  ? async (query) => {
                      return await options.request!.pageRequest!(
                        query,
                        nuxtApp[`$${client}`],
                      );
                    }
                  : undefined,
                addRequest: options.request?.addRequest
                  ? async (req) => {
                      return await options.request!.addRequest!(
                        req,
                        nuxtApp[`$${client}`],
                      );
                    }
                  : undefined,
                editRequest: options.request?.editRequest
                  ? async (req) => {
                      return await options.request!.editRequest!(
                        req,
                        nuxtApp[`$${client}`],
                      );
                    }
                  : undefined,
                delRequest: options.request?.delRequest
                  ? async (req) => {
                      return await options.request!.delRequest!(
                        req,
                        nuxtApp[`$${client}`],
                      );
                    }
                  : undefined,
                infoRequest: options.request?.infoRequest
                  ? async (req) => {
                      return await options.request!.infoRequest!(
                        req,
                        nuxtApp[`$${client}`],
                      );
                    }
                  : undefined,
              },
            },
          ),
        };
      },
    }),
  );
  const { autoFetch = true, refreshInterval } = options;
  if (autoFetch) results.crudExpose.doRefresh();
  if (refreshInterval) {
    useIntervalFn(() => results.crudExpose.doRefresh(), refreshInterval);
  }
  return results;
}
