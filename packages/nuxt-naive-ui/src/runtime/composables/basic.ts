import { customRef, type Ref } from "#imports";
import { get, set } from "lodash-es";
import type { Get, LiteralUnion, Paths } from "type-fest";

export type ToRefDeep<
  T extends object,
  K extends LiteralUnion<Paths<T>, string>,
  D extends Get<T, `${K}`> | undefined,
> = D extends undefined ? Ref<Get<T, `${K}`>> : Ref<D>;

export function toRefDeep<
  D extends undefined,
  T extends object = object,
  K extends LiteralUnion<Paths<T>, string> = LiteralUnion<Paths<T>, string>,
>(object: T, key: K): ToRefDeep<T, K, D>;
export function toRefDeep<
  D extends Get<T, `${K}`>,
  T extends object = object,
  K extends LiteralUnion<Paths<T>, string> = LiteralUnion<Paths<T>, string>,
>(object: T, key: K, defaultValue: D): ToRefDeep<T, K, D>;
export function toRefDeep<
  D extends Get<T, `${K}`> | undefined,
  T extends object = object,
  K extends LiteralUnion<Paths<T>, string> = LiteralUnion<Paths<T>, string>,
>(object: T, key: K, defaultValue?: D) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        let value = get(object, key);
        if (value === undefined) {
          set(object, key, defaultValue);
          value = defaultValue;
        }
        return value;
      },
      set(value) {
        set(object, key, value);
        trigger();
      },
    };
  });
}
