import { Dialog } from "../../components/Dialog";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useConsumo } from "../../api/consumo/useConsumo";
import { useDeleteConsumo } from "../../api/consumo/useDeleteConsumo";
import { useUpdateConsumo } from "../../api/consumo/useUpdateConsumo";
import { ConsumoForm } from "../../components/ConsumoForm";

export function ConsumoEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null;

  const { data, loading: loadingConsumo, error: loadError } = useConsumo(validId);
  const { update, loading, error, clearError } = useUpdateConsumo();
  const { remove, loading: deleting, error: deleteError } = useDeleteConsumo();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!validId) {
    return (
      <div className="surface">
        <div className="alert alert-danger" role="alert">
          ID de consumo inválido.
        </div>
      </div>
    );
  }

  if (loadingConsumo) {
    return (
      <div className="surface">
        <p className="text-muted" role="status">
          Carregando...
        </p>
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="surface">
        <div className="alert alert-danger" role="alert">
          {loadError ?? "Consumo não encontrado."}
        </div>
      </div>
    );
  }

  return (
    <>
      <ConsumoForm
        title="Editar consumo"
        initial={data}
        submitLabel="Salvar alterações"
        forceActionLabel="Salvar mesmo assim"
        loading={loading || deleting}
        error={error ?? deleteError}
        onClearError={clearError}
        onSuccess={() => {
          void navigate("/consumo");
        }}
        onDeleteClick={() => setConfirmDelete(true)}
        onSubmit={async (input) => {
          const result = await update(validId, input);
          if (result.status === "updated") {
            return { status: "ok" };
          }
          if (result.status === "conflict") {
            return result;
          }
          return { status: "error" };
        }}
      />

      {confirmDelete && (
        <Dialog
          title="Remover material"
          busy={deleting}
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={() => {
                  void (async () => {
                    const ok = await remove(validId);
                    if (ok) {
                      void navigate("/consumo");
                    }
                  })();
                }}
              >
                {deleting ? "Removendo..." : "Remover definitivamente"}
              </button>
            </>
          }
        >
          <p className="mb-2">
            Tem certeza que deseja remover <strong>{data.nome}</strong>?
          </p>
          <p className="mb-0 text-danger">Esta ação é irreversível.</p>
          {deleteError && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {deleteError}
            </div>
          )}
        </Dialog>
      )}
    </>
  );
}
