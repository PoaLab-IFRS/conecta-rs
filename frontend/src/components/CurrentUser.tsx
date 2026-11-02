import { authClient } from "../lib/authClient";

export function CurrentUser() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending || !session) {
    return null;
  }

  const isAdmin = session.user.role === "admin";

  return (
    <div className="d-flex align-items-center gap-2 text-muted">
      <i className="bi bi-person-circle" aria-hidden="true" />
      <span>{session.user.name}</span>
      <span className={`badge ${isAdmin ? "text-bg-primary" : "text-bg-secondary"}`}>
        {isAdmin ? "Administrador" : "Usuário"}
      </span>
    </div>
  );
}
