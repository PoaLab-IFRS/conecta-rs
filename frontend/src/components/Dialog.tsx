import { useEffect, useId, useRef, type ReactNode } from "react";
import { trapTabFocus } from "../lib/trapTabFocus";

type DialogProps = {
  title: string;
  children: ReactNode;
  actions: ReactNode;
  busy?: boolean;
  onClose: () => void;
};

export function Dialog({ title, children, actions, busy = false, onClose }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="app-dialog"
      aria-labelledby={titleId}
      aria-busy={busy}
      onKeyDown={trapTabFocus}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id={titleId} className="modal-title fs-5">
            {title}
          </h2>
          <button
            type="button"
            className="btn-close"
            aria-label="Fechar"
            disabled={busy}
            onClick={onClose}
          />
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">{actions}</div>
      </div>
    </dialog>
  );
}
