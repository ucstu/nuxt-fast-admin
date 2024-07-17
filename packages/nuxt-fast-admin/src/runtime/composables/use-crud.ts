export function useAdminCrud<
  Api extends $Api,
  Name extends keyof Api & `$${string}`,
  Res extends Partial<ResFromSchema<Api[Name]>>
>(api: Api, name: Name, options?: Partial<$CrudOptions<Api, Name, Res>>) {
  const resources = useResources();
  const res = cloneDeep(resources.get(api)?.get(name));
  if (!res) {
    console.warn(`[fast-admin] CRUD 资源 ${name.toString()} 未进行注册`);
    return options;
  }

  return defu<
    $CrudOptions<Api, Name, Res>,
    Array<Partial<$CrudOptions<any, any, any>>>
  >(
    options,
    {
      columns: referencesToColumns(
        api,
        normalizeReferences(api, options?.references ?? [])
      ),
    },
    {
      columns: referencesToColumns(
        api,
        normalizeReferences(api, res.references ?? [])
      ),
    },
    res
  ) as $CrudOptions<Api, Name, Res>;
}
