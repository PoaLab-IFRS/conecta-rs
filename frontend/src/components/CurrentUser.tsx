import { authClient } from "../lib/authClient";

export function CurrentUser() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return null;
  }

  const isAdmin = session.user.role === "admin";

  return (
    <div className="app-current-user">
      <i className="bi bi-person-circle app-current-user-icon" aria-hidden="true" />
      <span className="app-current-user-name">{session.user.name}</span>
      <span className={`badge app-current-user-role ${isAdmin ? "app-current-user-admin" : ""}`}>
        {isAdmin ? "Administrador" : "Usuário"}
      </span>
    </div>
  );
}
