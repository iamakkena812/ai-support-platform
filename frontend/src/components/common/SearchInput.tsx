/**
 * Search input component.
 *
 * Displays a reusable search input.
 */

import { Search, X } from "lucide-react";

/**
 * Component properties.
 */
export interface SearchInputProps {
  /**
   * Current search value.
   */
  readonly value: string;

  /**
   * Placeholder text.
   */
  readonly placeholder?: string;

  /**
   * Whether the input is disabled.
   */
  readonly disabled?: boolean;

  /**
   * Called when the search value changes.
   *
   * @param value Search value.
   */
  readonly onChange: (
    value: string,
  ) => void;
}

/**
 * Search input.
 *
 * @param props Component properties.
 * @returns Search input component.
 */
export function SearchInput({
  value,
  placeholder = "Search...",
  disabled = false,
  onChange,
}: SearchInputProps): React.JSX.Element {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="search"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-100"
      />

      {value.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}