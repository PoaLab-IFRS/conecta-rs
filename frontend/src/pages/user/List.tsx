import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteUser } from "../../api/user/useDeleteUser";
import { useUsers } from "../../api/user/useUsers";
import { authClient } from "../../lib/authClient";
import type { TipoUser, User } from "../../models/user";

const tipoUserLabels: Record<TipoUser, string> = {
  ADMIN: "Administrador",
  PROFESSOR: "Professor",
  USUARIO: "Usuário",
};

const tipoUserClasses: Record<TipoUser, string> = {
  ADMIN: "text-bg-danger",
  PROFESSOR: "text-bg-primary",
  USUARIO: "text-bg-secondary",
};

export function UserList() {
  const { data: users, loading, error, reload } = useUsers();
  const {
    remove,
    loading: deleting,
    error: deleteError,
  } = useDeleteUser();
  const { data: session } = authClient.useSession();

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [sendingPasswordReset, setSendingPasswordReset] =
    useState<string | null>(null);
  const [passwordResetMessage, setPasswordResetMessage] =
    useState<string | null>(null);
  const [passwordResetError, setPasswordResetError] =
    useState<string | null>(null);
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = users?.filter((user) => {
    const role = tipoUserLabels[user.tipoUser].toLowerCase();
    return (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      role.includes(normalizedSearch)
    );
  });

  async function sendPasswordReset(email: string) {
    setSendingPasswordReset(email);
    setPasswordResetMessage(null);
    setPasswordResetError(null);

    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setPasswordResetError(
          result.error.message ??
            "Não foi possível enviar o e-mail de redefinição.",
        );
        return;
      }

      setPasswordResetMessage(
        `E-mail de redefinição enviado para ${email}.`,
      );
    } catch {
      setPasswordResetError("Não foi possível enviar o e-mail de redefinição.");
    } finally {
      setSendingPasswordReset(null);
    }
  }

  async function confirmDelete() {
    if (!userToDelete) {
      return;
    }

    const deleted = await remove(userToDelete.id);

    if (deleted) {
      setUserToDelete(null);
      reload();
    }
  }

  return (
    <>
      <main className="management-page">
        <div className="container management-container">
          <header className="management-header">
            <div>
              <Link to="/menu" className="management-breadcrumb">
                <i className="bi bi-arrow-left me-1" aria-hidden="true" />
                Voltar ao menu
              </Link>
              <h1>Usuários</h1>
              <p>Gerencie contas, permissões e redefinições de acesso.</p>
            </div>
            <Link to="/usuarios/novo" className="btn management-primary-button">
              <i className="bi bi-person-plus me-2" aria-hidden="true" />
              Novo usuário
            </Link>
          </header>

          <div className="management-toolbar">
            <label htmlFor="user-search" className="management-search">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                id="user-search"
                type="search"
                className="form-control"
                placeholder="Buscar por nome, e-mail ou papel"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            {users && (
              <span className="management-result-count">
                {filteredUsers?.length ?? 0} {(filteredUsers?.length ?? 0) === 1 ? "usuário" : "usuários"}
              </span>
            )}
          </div>

        {(error || deleteError) && (
          <div className="alert alert-danger" role="alert">
            {error ?? deleteError}
          </div>
        )}

        {passwordResetMessage && (
          <div className="alert alert-success" role="alert">
            {passwordResetMessage}
          </div>
        )}

        {passwordResetError && (
          <div className="alert alert-danger" role="alert">
            {passwordResetError}
          </div>
        )}

        {loading ? (
          <div className="management-loading">
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            <span>Carregando usuários...</span>
          </div>
        ) : (
          <div className="management-table-card table-responsive">
            <table className="table management-table align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Papel</th>
                  <th scope="col" className="text-end">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers?.length ? (
                  filteredUsers.map((user) => {
                    const currentUser = user.id === session?.user.id;
                    const sendingReset =
                      sendingPasswordReset === user.email;

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="management-item-name">
                            <span className="management-item-icon management-user-icon">
                              <i className="bi bi-person" aria-hidden="true" />
                            </span>
                            <div>
                              <strong>{user.name}</strong>
                              {currentUser && <small>Usuário atual</small>}
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`badge management-role-badge ${tipoUserClasses[user.tipoUser]}`}
                          >
                            {tipoUserLabels[user.tipoUser]}
                          </span>
                        </td>

                        <td className="text-end text-nowrap">
                          <Link
                            to={`/usuarios/${user.id}/editar`}
                            className="btn management-action-button me-2"
                            title={`Editar ${user.name}`}
                            aria-label={`Editar ${user.name}`}
                          >
                            <i className="bi bi-pencil" aria-hidden="true" />
                          </Link>

                          <button
                            type="button"
                            className="btn management-action-button management-action-warning me-2"
                            title={`Enviar redefinição de senha para ${user.email}`}
                            aria-label={`Enviar redefinição de senha para ${user.email}`}
                            disabled={sendingPasswordReset !== null}
                            onClick={() =>
                              void sendPasswordReset(user.email)
                            }
                          >
                            {sendingReset ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                aria-hidden="true"
                              />
                            ) : (
                              <i
                                className="bi bi-key"
                                aria-hidden="true"
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            className="btn management-action-button management-action-danger"
                            title={
                              currentUser
                                ? "Não é possível excluir o usuário atual"
                                : `Excluir ${user.name}`
                            }
                            aria-label={`Excluir ${user.name}`}
                            disabled={currentUser || deleting}
                            onClick={() => setUserToDelete(user)}
                          >
                            <i className="bi bi-trash" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="management-empty-state">
                        <i className="bi bi-person-x" aria-hidden="true" />
                        <strong>Nenhum usuário encontrado</strong>
                        <span>Tente outro termo ou cadastre um novo usuário.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>

      {userToDelete && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">Excluir usuário</h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fechar"
                  disabled={deleting}
                  onClick={() => setUserToDelete(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  Tem certeza que deseja excluir{" "}
                  <strong>{userToDelete.name}</strong>?
                </p>

                <p className="mb-0 text-danger">
                  Esta ação é irreversível.
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={deleting}
                  onClick={() => setUserToDelete(null)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={deleting}
                  onClick={() => void confirmDelete()}
                >
                  {deleting ? "Excluindo..." : "Excluir definitivamente"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}