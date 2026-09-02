import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");
function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getAttribute("hidden") === null,
  );
}
function combineClassNames(...classNames) {
  return classNames.filter(Boolean).join(" ");
}
/**
 * Renders an accessible modal dialog in a portal attached to document.body.
 *
 * Props:
 * - isOpen controls whether the dialog is rendered.
 * - onClose is called when the user requests closure.
 * - title provides the visible and accessible dialog name.
 * - children contains the dialog body.
 * - closeOnBackdrop and closeOnEscape enable optional closing interactions.
 * - showCloseButton controls the top-right close control.
 * - closeLabel provides accessible text for that close control.
 * - className and overlayClassName expose styling hooks.
 * - initialFocusRef chooses the element focused after opening.
 * - testId optionally identifies the dialog panel in automated tests.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeLabel = "Close dialog",
  className,
  overlayClassName,
  initialFocusRef,
  testId,
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTarget =
      initialFocusRef?.current ?? getFocusableElements(dialog)[0] ?? dialog;
    focusTarget.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") {
        return;
      }
      const focusableElements = getFocusableElements(dialog);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (
        event.shiftKey &&
        (activeElement === firstElement || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElementRef.current?.focus();
    };
  }, [closeOnEscape, initialFocusRef, isOpen]);
  if (!isOpen || typeof document === "undefined") {
    return null;
  }
  const handleBackdropMouseDown = (event) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onCloseRef.current();
    }
  };
  return createPortal(
    <div
      className={combineClassNames("hrnet-modal__overlay", overlayClassName)}
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        className={combineClassNames("hrnet-modal", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid={testId}
      >
        <div className="hrnet-modal__header">
          <h2 className="hrnet-modal__title" id={titleId}>
            {title}
          </h2>
          {showCloseButton ? (
            <button
              className="hrnet-modal__close"
              type="button"
              aria-label={closeLabel}
              onClick={() => onCloseRef.current()}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M6.7 5.3 12 10.6l5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3 1.4-1.4Z" />
              </svg>
            </button>
          ) : null}
        </div>
        <div className="hrnet-modal__content">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
