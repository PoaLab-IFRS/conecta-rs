type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <span className="text-muted small">{total} registro(s)</span>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
          {page} / {totalPages}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
