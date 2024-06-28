import type {
  FsNavMenuOrPage,
  FsNavMenuWithPages,
  FsNavPageFilled,
} from "../../module";

export function isFsNavMenu(
  menuOrPage: FsNavMenuOrPage
): menuOrPage is FsNavMenuWithPages {
  return !!menuOrPage && "key" in menuOrPage;
}

export function isFsNavPage(
  menuOrPage: FsNavMenuOrPage
): menuOrPage is FsNavPageFilled {
  return !!menuOrPage && "name" in menuOrPage;
}
