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
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Usuários</h1>

          <Link to="/usuarios/novo" className="btn btn-primary">
            Novo usuário
          </Link>
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
          <p className="text-muted">Carregando...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
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
                {users?.length ? (
                  users.map((user) => {
                    const currentUser = user.id === session?.user.id;
                    const sendingReset =
                      sendingPasswordReset === user.email;

                    return (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`badge ${tipoUserClasses[user.tipoUser]}`}
                          >
                            {tipoUserLabels[user.tipoUser]}
                          </span>
                        </td>

                        <td className="text-end text-nowrap">
                          <Link
                            to={`/usuarios/${user.id}/editar`}
                            className="btn btn-sm btn-outline-primary me-2"
                            title={`Editar ${user.name}`}
                            aria-label={`Editar ${user.name}`}
                          >
                            <i className="bi bi-pencil" aria-hidden="true" />
                          </Link>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning me-2"
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
                            className="btn btn-sm btn-outline-danger"
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
                    <td colSpan={4} className="text-muted">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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