import { useNavigate } from "react-router-dom";
import { useCreateConsumo } from "../../api/consumo/useCreateConsumo";
import { ConsumoForm } from "../../components/ConsumoForm";

export function ConsumoNew() {
  const navigate = useNavigate();
  const { create, loading, error, clearError } = useCreateConsumo();

  return (
    <ConsumoForm
      title="Novo consumo"
      submitLabel="Salvar"
      forceActionLabel="Criar novo mesmo assim"
      loading={loading}
      error={error}
      onClearError={clearError}
      onSuccess={() => {
        void navigate("/consumo");
      }}
      onSubmit={async (input) => {
        const result = await create(input);
        if (result.status === "created") {
          return { status: "ok" };
        }
        if (result.status === "conflict") {
          return result;
        }
        return { status: "error" };
      }}
    />
  );
}
