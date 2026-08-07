/**
 * Export menu component.
 *
 * Displays reusable export actions.
 */

import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";

/**
 * Export format.
 */
export type ExportFormat =
  | "csv"
  | "excel"
  | "pdf"
  | "print";

/**
 * Component properties.
 */
export interface ExportMenuProps {
  /**
   * Export callback.
   *
   * @param format Export format.
   */
  readonly onExport: (
    format: ExportFormat,
  ) => void;
}

/**
 * Export menu.
 *
 * @param props Component properties.
 * @returns Export menu component.
 */
export function ExportMenu({
  onExport,
}: ExportMenuProps): React.JSX.Element {
  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
        <Download size={16} />

        Export
      </summary>

      <div className="absolute right-0 z-20 mt-2 w-52 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
        <button
          type="button"
          onClick={() =>
            onExport("csv")
          }
          className="flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-slate-100"
        >
          <FileText size={16} />

          Export CSV
        </button>

        <button
          type="button"
          onClick={() =>
            onExport("excel")
          }
          className="flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-slate-100"
        >
          <FileSpreadsheet
            size={16}
          />

          Export Excel
        </button>

        <button
          type="button"
          onClick={() =>
            onExport("pdf")
          }
          className="flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-slate-100"
        >
          <FileText size={16} />

          Export PDF
        </button>

        <button
          type="button"
          onClick={() =>
            onExport("print")
          }
          className="flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-slate-100"
        >
          <Printer size={16} />

          Print
        </button>
      </div>
    </details>
  );
}