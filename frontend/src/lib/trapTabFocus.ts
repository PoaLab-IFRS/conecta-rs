import type { KeyboardEvent } from "react";

export function trapTabFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab" || event.defaultPrevented) return;

  const container = event.currentTarget;
  const controls = [
    ...container.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), summary, [tabindex="0"]',
    ),
  ].filter((control) => {
    const collapsedGroup = control.closest("details:not([open])");
    return (
      control.tabIndex >= 0 &&
      control.getClientRects().length > 0 &&
      window.getComputedStyle(control).visibility !== "hidden" &&
      (!collapsedGroup || control === collapsedGroup.querySelector(":scope > summary"))
    );
  });
  const first = controls[0];
  const last = controls[controls.length - 1];

  if (!first || !last) {
    event.preventDefault();
    container.focus();
  } else if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === container)
  ) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
