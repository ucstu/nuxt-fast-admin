import type {
  FastNavMenu,
  FastNavMenuFilled,
  FastNavPage,
  FastNavPageFilled,
} from "../types";

export function isNavMenu(
  value: FastNavMenu | FastNavPage | undefined,
): value is FastNavMenu {
  return value !== undefined && "name" in value;
}

export function isNavPage(
  value: FastNavMenu | FastNavPage | undefined,
): value is FastNavPage {
  return value !== undefined && !("name" in value);
}

export function isNavMenuFilled(
  value: FastNavMenuFilled | FastNavPageFilled | undefined,
): value is FastNavMenuFilled {
  return value !== undefined && "name" in value;
}

export function isNavPageFilled(
  value: FastNavMenuFilled | FastNavPageFilled | undefined,
): value is FastNavPageFilled {
  return value !== undefined && !("name" in value);
}
