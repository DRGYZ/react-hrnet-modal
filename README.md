# @drgyz/hrnet-accessible-modal

An accessible and styleable React JavaScript modal extracted from the behavior
HRnet used from `jquery-modal`. The package contains no jQuery code and has no
runtime dependency other than React and React DOM.

## Why this package exists

The legacy HRnet confirmation dialog was difficult to customize and depended
on jQuery. This component keeps the UI behavior HRnet needs while using a
controlled React API, a portal, keyboard handling, and accessible dialog
semantics.

AJAX loading from the original jQuery plugin is intentionally not converted.
It is unrelated to the modal's core UI responsibility and is outside the
project requirements.

## Installation

GitHub Packages requires an authenticated GitHub token, including for public
npm packages. Add a classic personal access token with `read:packages` to your
user-level `.npmrc` without committing the token:

```ini
@drgyz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

```bash
npm install @drgyz/hrnet-accessible-modal
```

Import both the component and its default stylesheet:

```jsx
import { useState } from "react";
import { Modal } from "@drgyz/hrnet-accessible-modal";
import "@drgyz/hrnet-accessible-modal/style.css";

export function EmployeeConfirmation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Create employee
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Employee created"
      >
        <p>The employee record was saved successfully.</p>
      </Modal>
    </>
  );
}
```

The parent owns the open state. `Modal` requests closure through `onClose`; it
never mutates application state itself.

## Props

| Prop               | Type                             | Default          | Purpose                                           |
| ------------------ | -------------------------------- | ---------------- | ------------------------------------------------- |
| `isOpen`           | `boolean`                        | required         | Controls whether the dialog is rendered.          |
| `onClose`          | `() => void`                     | required         | Called when the user requests closure.            |
| `title`            | `ReactNode`                      | required         | Visible accessible name for the dialog.           |
| `children`         | `ReactNode`                      | required         | Content rendered inside the dialog.               |
| `closeOnBackdrop`  | `boolean`                        | `true`           | Allows a click on the overlay to request closure. |
| `closeOnEscape`    | `boolean`                        | `true`           | Allows Escape to request closure.                 |
| `showCloseButton`  | `boolean`                        | `true`           | Shows the top-right close control.                |
| `closeLabel`       | `string`                         | `"Close dialog"` | Accessible label for the close control.           |
| `className`        | `string`                         | none             | Adds a class to the dialog panel.                 |
| `overlayClassName` | `string`                         | none             | Adds a class to the backdrop.                     |
| `initialFocusRef`  | `RefObject<HTMLElement \| null>` | none             | Chooses the element focused after opening.        |
| `testId`           | `string`                         | none             | Adds a test identifier to the dialog panel.       |

## Accessibility behavior

- Renders `role="dialog"` and `aria-modal="true"`.
- Connects the visible title through `aria-labelledby`.
- Moves focus inside the dialog when it opens.
- Traps Tab and Shift+Tab inside the active dialog.
- Restores focus to the previously focused element after closing.
- Supports Escape and backdrop closing when enabled.
- Locks background page scrolling while open.
- Honors `prefers-reduced-motion` in the default styles.

The consumer remains responsible for meaningful content, button labels, form
validation, and deciding when the modal should open or close.

## Styling

The package ships a small default stylesheet and exposes CSS custom properties:

```css
:root {
  --hrnet-modal-backdrop: rgb(15 23 42 / 68%);
  --hrnet-modal-surface: #ffffff;
  --hrnet-modal-text: #172033;
  --hrnet-modal-radius: 1rem;
  --hrnet-modal-shadow: 0 24px 70px rgb(15 23 42 / 30%);
}
```

Use `className` and `overlayClassName` when an application needs additional
component-specific selectors.

## Development

```bash
npm install
npm run dev
npm run check
```

`npm run check` runs linting, tests, and the production library build.
`prepublishOnly` runs the same gate before publication.

## Package output

`npm run build` creates:

- `dist/index.js` for ES module consumers;
- `dist/index.cjs` for CommonJS consumers;
- `dist/style.css` default styles.

## License

MIT
