import { useContext, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SidebarSearchContext } from "./sidebarSearchContext";

const desktopQuery = "(min-width: 992px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isDesktop() {
  return window.matchMedia(desktopQuery).matches;
}

export function PageSearch({ children }: { children: ReactNode }) {
  const target = useContext(SidebarSearchContext);
  const desktop = useSyncExternalStore(subscribe, isDesktop, () => false);
  return desktop && target ? createPortal(children, target) : children;
}
