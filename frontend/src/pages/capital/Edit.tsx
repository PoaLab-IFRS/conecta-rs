import { Dialog } from "../../components/Dialog";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCapital } from "../../api/capital/useCapital";
import { useDeleteCapital } from "../../api/capital/useDeleteCapital";
import { useUpdateCapital } from "../../api/capital/useUpdateCapital";
import { CapitalForm } from "../../components/CapitalForm";

export function CapitalEdit() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ? Number(params.id) : null;
  const validId = id !== null && Number.isInteger(id) && id > 0 ? id : null;

  const { data, loading: loadingCapital, error: loadError } = useCapital(validId);
  const { update, loading, error, clearError } = useUpdateCapital();
  const { remove, loading: deleting, error: deleteError } = useDeleteCapital();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (validId === null) {
    return (
      <div className="surface">
        <div className="alert alert-danger" role="alert">
          ID de Capital inválido.
        </div>
      </div>
    );
  }

  if (loadingCapital) {
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
          {loadError ?? "Capital não encontrado."}
        </div>
      </div>
    );
  }

  return (
    <>
      <CapitalForm
        title="Editar Capital"
        initial={data}
        submitLabel="Salvar alterações"
        loading={loading || deleting}
        error={error ?? deleteError}
        onClearError={clearError}
        onSuccess={() => {
          void navigate("/capital");
        }}
        onDeleteClick={() => setConfirmDelete(true)}
        onSubmit={async (input) => {
          const result = await update(validId, input);
          return result.status === "updated" ? { status: "ok" } : { status: "error" };
        }}
      />

      {confirmDelete && (
        <Dialog
          title="Remover Capital"
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
                    const deleted = await remove(validId);
                    if (deleted) {
                      void navigate("/capital");
                    }
                  })();
                }}
              >
                {deleting ? "Removendo..." : "Remover definitivamente"}
              </button>
            </>
          }
        >
          <p>
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
