import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../api/user/useCreateUser";
import { UserForm } from "../../components/UserForm";

export function UserNew() {
  const navigate = useNavigate();
  const { create, loading, error, clearError } = useCreateUser();

  return (
    <UserForm
      title="Novo usuário"
      submitLabel="Adicionar usuário"
      loading={loading}
      error={error}
      onClearError={clearError}
      onSuccess={() => {
        void navigate("/menu");
      }}
      onSubmit={async (input) => {
        const result = await create(input);

        return result.status === "created"
          ? { status: "ok" }
          : { status: "error" };
      }}
    />
  );
}