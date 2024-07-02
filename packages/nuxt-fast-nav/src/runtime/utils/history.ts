import { isEqual } from "lodash-es";
import type { FsNavHistory } from "../types";

export function historyEqual(a?: FsNavHistory, b?: FsNavHistory) {
  return a && b && isEqual(a.to, b.to);
}
