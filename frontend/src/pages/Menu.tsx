import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../lib/authClient";
import poalabSymbol from "../assets/poalab-symbol.svg";
import { useUsers } from "../api/user/useUsers";
import { listCapitais } from "../api/capital/listCapitais";
import { listConsumos } from "../api/consumo/listConsumos";
import type { Capital } from "../models/capital";
import type { Consumo } from "../models/consumo";

type RecentItem = {
  id: string;
  name: string;
  description: string | null;
  type: "capital" | "consumo";
};

export function Menu() {
  const { data: session } = authClient.useSession();
  const isAdmin = session?.user.role === "admin";
  const userName = session?.user.name?.trim();
  const { data: users } = useUsers();
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [menuSearch, setMenuSearch] = useState("");
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(() =>
    Math.floor(Math.random() * 16) + 3,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadRecentItems() {
      try {
        const [capitais, consumos] = await Promise.all([
          listCapitais({ page: 1, pageSize: 5 }),
          listConsumos({ page: 1, pageSize: 5 }),
        ]);

        if (cancelled) return;

        const capitalItems: RecentItem[] = capitais.data.map((item: Capital) => ({
          id: `capital-${item.id}`,
          name: item.nome,
          description: item.descricao,
          type: "capital",
        }));
        const consumoItems: RecentItem[] = consumos.data.map((item: Consumo) => ({
          id: `consumo-${item.id}`,
          name: item.nome,
          description: item.descricao,
          type: "consumo",
        }));

        const interleaved: RecentItem[] = [];
        for (let index = 0; index < 5; index++) {
          if (consumoItems[index]) interleaved.push(consumoItems[index]);
          if (capitalItems[index]) interleaved.push(capitalItems[index]);
        }
        setRecentItems(interleaved.slice(0, 5));
      } catch {
        if (!cancelled) setRecentItems([]);
      } finally {
        if (!cancelled) setLoadingRecent(false);
      }
    }

    void loadRecentItems();
    const refresh = window.setInterval(() => {
      void loadRecentItems();
      setStockAlerts(Math.floor(Math.random() * 16) + 3);
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(refresh);
    };
  }, []);

  const search = menuSearch.trim().toLowerCase();
  const showCapital = "itens de capital capital patrimônio".includes(search);
  const showConsumo = "itens de consumo consumos estoque".includes(search);
  const showUsers =
    isAdmin && "usuários usuarios contas permissões permissões".includes(search);

  return (
    <main className="menu-page">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-sidebar-brand" to="/menu">
          <img src={poalabSymbol} alt="" width="42" height="42" aria-hidden="true" />
          <div>
            <strong>POALab</strong>
            <span>Sistema de gestão</span>
          </div>
        </Link>

        <label className="dashboard-search" htmlFor="dashboard-menu-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            id="dashboard-menu-search"
            type="search"
            placeholder="Pesquisar no menu"
            value={menuSearch}
            onChange={(event) => setMenuSearch(event.target.value)}
          />
        </label>

        <nav className="dashboard-navigation" aria-label="Menu principal">
          <button
            type="button"
            className="dashboard-menu-section"
            onClick={() => setInventoryOpen((open) => !open)}
            aria-expanded={inventoryOpen}
          >
            <span>
              <i className="bi bi-grid" aria-hidden="true" />
              Inventário
            </span>
            <i
              className={`bi ${inventoryOpen ? "bi-chevron-down" : "bi-chevron-right"}`}
              aria-hidden="true"
            />
          </button>

          {inventoryOpen && (
            <div className="dashboard-submenu">
              {(showCapital || !search) && (
                <Link to="/capital">
                  <i className="bi bi-currency-dollar" aria-hidden="true" />
                  Itens de capital
                </Link>
              )}
              {(showConsumo || !search) && (
                <Link to="/consumo">
                  <i className="bi bi-box-seam" aria-hidden="true" />
                  Itens de consumo
                </Link>
              )}
            </div>
          )}

          {showUsers && (
            <Link className="dashboard-menu-link" to="/usuarios">
              <span>
                <i className="bi bi-people" aria-hidden="true" />
                Usuários
              </span>
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-welcome">
          <div>
            <span>Painel principal</span>
            <h1>{userName ? `Olá, ${userName}` : "Olá"}</h1>
          </div>
        </header>

        <div className="dashboard-stat-grid">
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon dashboard-stat-users">
              <i className="bi bi-people" aria-hidden="true" />
            </span>
            <div>
              {isAdmin ? (
                <>
                  <strong>{users?.length ?? 0}</strong>
                  <span>Usuários cadastrados</span>
                </>
              ) : (
                <span className="dashboard-stat-restricted">
                  Você não tem perfil para acessar esta informação
                </span>
              )}
            </div>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon dashboard-stat-schools">
              <i className="bi bi-building" aria-hidden="true" />
            </span>
            <div>
              <strong>12</strong>
              <span>Escolas cadastradas</span>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <span className="dashboard-stat-icon dashboard-stat-alerts">
              <i className="bi bi-exclamation-triangle" aria-hidden="true" />
            </span>
            <div>
              <strong>{stockAlerts}</strong>
              <span>Alertas de estoque</span>
            </div>
          </article>
        </div>

        <section className="dashboard-recent-card" aria-labelledby="recent-items-title">
          <div className="dashboard-recent-header">
            <div>
              <span>Atualizações recentes</span>
              <h2 id="recent-items-title">Últimos itens cadastrados</h2>
            </div>
            <span className="dashboard-live-label">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              Atualizado automaticamente
            </span>
          </div>

          {loadingRecent ? (
            <div className="dashboard-loading">
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              Carregando itens...
            </div>
          ) : recentItems.length ? (
            <div className="dashboard-recent-list">
              {recentItems.map((item) => (
                <article className="dashboard-recent-item" key={item.id}>
                  <span className={`dashboard-recent-icon dashboard-recent-${item.type}`}>
                    <i
                      className={`bi ${item.type === "capital" ? "bi-currency-dollar" : "bi-box-seam"}`}
                      aria-hidden="true"
                    />
                  </span>
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.description || "Sem descrição cadastrada"}</p>
                  </div>
                  <span className="dashboard-item-type">
                    {item.type === "capital" ? "Capital" : "Consumo"}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">Nenhum item cadastrado.</div>
          )}
        </section>
      </section>
    </main>
  );
}