import { useRef, useState } from "react";
import { Modal } from "../src";
export function Demo() {
  const [isOpen, setIsOpen] = useState(false);
  const continueButtonRef = useRef(null);
  return (
    <main className="demo-shell">
      <section className="demo-card">
        <p className="demo-eyebrow">WealthHealth UI library</p>
        <h1>React HRnet Modal</h1>
        <p>
          A controlled, accessible replacement for HRnet's legacy jQuery
          confirmation dialog.
        </p>
        <button
          className="demo-primary-button"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          Create employee
        </button>
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Employee created"
        initialFocusRef={continueButtonRef}
      >
        <p>The employee record was added to HRnet successfully.</p>
        <div className="demo-actions">
          <button
            className="demo-secondary-button"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            View employee list
          </button>
          <button
            ref={continueButtonRef}
            className="demo-primary-button"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Continue
          </button>
        </div>
      </Modal>
    </main>
  );
}
