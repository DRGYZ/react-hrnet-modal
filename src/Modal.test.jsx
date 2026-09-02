import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";
describe("Modal", () => {
  it("does not render while closed", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Employee created">
        Saved successfully.
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("renders an accessible dialog with its title and content", () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="Employee created">
        Saved successfully.
      </Modal>,
    );
    expect(
      screen.getByRole("dialog", { name: "Employee created" }),
    ).toHaveTextContent("Saved successfully.");
  });
  it("requests closure from the close button and Escape key", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal isOpen onClose={onClose} title="Employee created">
        Saved successfully.
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it("only closes from a direct backdrop interaction", () => {
    const onClose = vi.fn();
    render(
      <Modal
        isOpen
        onClose={onClose}
        title="Employee created"
        testId="modal-panel"
      >
        Saved successfully.
      </Modal>,
    );
    const panel = screen.getByTestId("modal-panel");
    const overlay = panel.parentElement;
    expect(overlay).not.toBeNull();
    fireEvent.mouseDown(panel);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });
  it("honors disabled backdrop and Escape closing", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal
        isOpen
        onClose={onClose}
        title="Employee created"
        closeOnBackdrop={false}
        closeOnEscape={false}
        testId="modal-panel"
      >
        Saved successfully.
      </Modal>,
    );
    const overlay = screen.getByTestId("modal-panel").parentElement;
    fireEvent.mouseDown(overlay);
    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });
  it("moves focus inside, traps it, and restores the previous focus", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <button type="button">Open confirmation</button>
        <Modal isOpen={false} onClose={vi.fn()} title="Employee created">
          <button type="button">Continue</button>
        </Modal>
      </>,
    );
    const opener = screen.getByRole("button", { name: "Open confirmation" });
    opener.focus();
    rerender(
      <>
        <button type="button">Open confirmation</button>
        <Modal isOpen onClose={vi.fn()} title="Employee created">
          <button type="button">Continue</button>
        </Modal>
      </>,
    );
    const closeButton = screen.getByRole("button", { name: "Close dialog" });
    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(closeButton).toHaveFocus();
    continueButton.focus();
    await user.tab();
    expect(closeButton).toHaveFocus();
    rerender(
      <>
        <button type="button">Open confirmation</button>
        <Modal isOpen={false} onClose={vi.fn()} title="Employee created">
          <button type="button">Continue</button>
        </Modal>
      </>,
    );
    expect(
      screen.getByRole("button", { name: "Open confirmation" }),
    ).toHaveFocus();
  });
  it("uses the requested initial focus target and locks body scrolling", () => {
    const initialFocusRef = createRef();
    render(
      <Modal
        isOpen
        onClose={vi.fn()}
        title="Employee created"
        initialFocusRef={initialFocusRef}
      >
        <button ref={initialFocusRef} type="button">
          Confirm
        </button>
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus();
    expect(document.body).toHaveStyle({ overflow: "hidden" });
  });
});
