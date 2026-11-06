import { useEffect, useRef, useState, type ReactNode } from "react";
import Offcanvas from "bootstrap/js/dist/offcanvas";
import { NavLink, useLocation } from "react-router-dom";
import poalabSymbol from "../assets/poalab-symbol.svg";
import { SidebarSearchContext } from "./sidebarSearchContext";
import { trapTabFocus } from "../lib/trapTabFocus";

function AppBrand() {
  return (
    <div className="app-brand">
      <img src={poalabSymbol} alt="" width={54} height={54} />
      <span>POALAB</span>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const offcanvasRef = useRef<Offcanvas | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTarget, setSearchTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const offcanvas = new Offcanvas(menu);
    offcanvasRef.current = offcanvas;
    let transition: "opening" | "closing" | null = null;
    let pendingShow = false;
    let pendingHide = false;
    // Bootstrap's delayed callbacks must finish before reversing the transition.
    const onShow = (event: Event) => {
      if (transition === "closing") {
        event.preventDefault();
        pendingShow = true;
        return;
      }
      transition = "opening";
      pendingHide = false;
      setMenuOpen(true);
    };
    const onShown = () => {
      transition = null;
      if (pendingHide) offcanvas.hide();
    };
    const onHide = (event: Event) => {
      if (transition === "opening") {
        event.preventDefault();
        pendingHide = true;
        return;
      }
      transition = "closing";
      setMenuOpen(false);
    };
    const onHidden = () => {
      transition = null;
      const toggle = toggleRef.current;
      if (pendingShow && toggle?.getClientRects().length) {
        pendingShow = false;
        offcanvas.show();
        return;
      }
      pendingShow = false;
      if (toggle?.getClientRects().length) toggle.focus();
    };
    menu.addEventListener("show.bs.offcanvas", onShow);
    menu.addEventListener("shown.bs.offcanvas", onShown);
    menu.addEventListener("hide.bs.offcanvas", onHide);
    menu.addEventListener("hidden.bs.offcanvas", onHidden);
    return () => {
      menu.removeEventListener("show.bs.offcanvas", onShow);
      menu.removeEventListener("shown.bs.offcanvas", onShown);
      menu.removeEventListener("hide.bs.offcanvas", onHide);
      menu.removeEventListener("hidden.bs.offcanvas", onHidden);
      offcanvas.dispose();
      offcanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    offcanvasRef.current?.hide();
  }, [pathname]);

  function closeMenu() {
    offcanvasRef.current?.hide();
  }

  return (
    <SidebarSearchContext.Provider value={searchTarget}>
      <div className="app-layout">
        <a className="skip-link visually-hidden-focusable" href="#conteudo">
          Ir para o conteúdo
        </a>
        <header className="mobile-header" inert={menuOpen}>
          <AppBrand />
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-label="Abrir menu"
            aria-controls="app-menu"
            aria-expanded={menuOpen}
            onClick={() => offcanvasRef.current?.toggle()}
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
        </header>
        <aside
          ref={menuRef}
          id="app-menu"
          className="app-sidebar offcanvas-lg offcanvas-start"
          tabIndex={-1}
          aria-label="Menu de navegação"
          onKeyDown={(event) => {
            if (menuOpen) trapTabFocus(event);
          }}
        >
          <div className="sidebar-header">
            <AppBrand />
            <button
              className="menu-close"
              type="button"
              aria-label="Fechar menu"
              onClick={closeMenu}
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>
          <div className="sidebar-search-slot" ref={setSearchTarget} />
          <nav aria-label="Menu principal">
            <details className="inventory-group" open>
              <summary className="nav-heading">
                <i className="bi bi-clipboard-fill" aria-hidden="true" />
                <span>Inventário</span>
                <i className="bi bi-chevron-down inventory-chevron" aria-hidden="true" />
              </summary>
              <div className="app-nav">
                <NavLink
                  to="/capital"
                  aria-current={pathname === "/capital" ? "page" : "location"}
                  onClick={closeMenu}
                >
                  Itens de Capital
                </NavLink>
                <NavLink
                  to="/consumo"
                  aria-current={pathname === "/consumo" ? "page" : "location"}
                  onClick={closeMenu}
                >
                  Itens de Consumo
                </NavLink>
              </div>
            </details>
          </nav>
        </aside>
        <main id="conteudo" className="app-main" tabIndex={-1} inert={menuOpen}>
          {children}
        </main>
      </div>
    </SidebarSearchContext.Provider>
  );
}
