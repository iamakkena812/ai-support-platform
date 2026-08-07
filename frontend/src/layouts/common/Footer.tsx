/**
 * Footer component.
 *
 * Displays the application footer.
 */

/**
 * Footer component.
 *
 * @returns Footer component.
 */
export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 md:flex-row">
        <div>
          © {new Date().getFullYear()} Enterprise AI Support Platform
        </div>

        <div className="flex items-center gap-6">
          <span>Version 1.0.0</span>

          <a
            href="https://github.com/techakkena/ai-support-platform"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-900"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}