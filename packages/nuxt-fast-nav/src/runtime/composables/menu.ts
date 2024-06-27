import { useState } from "#imports";
import type { FsNavMenuWithPages } from "../types";

export function useMenus() {
  return useState<FsNavMenuWithPages>("fast-nav:menus");
}
