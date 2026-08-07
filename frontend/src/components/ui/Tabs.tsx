/**
 * Tabs component.
 *
 * Displays reusable tab navigation.
 */

import type {
  ReactNode,
} from "react";

/**
 * Tab item.
 */
export interface TabItem {
  /**
   * Tab identifier.
   */
  readonly id: string;

  /**
   * Tab label.
   */
  readonly label: string;

  /**
   * Tab content.
   */
  readonly content: ReactNode;

  /**
   * Disabled state.
   */
  readonly disabled?: boolean;
}

/**
 * Component properties.
 */
export interface TabsProps {
  /**
   * Available tabs.
   */
  readonly tabs: readonly TabItem[];

  /**
   * Active tab.
   */
  readonly activeTab: string;

  /**
   * Tab change callback.
   *
   * @param tabId Selected tab.
   */
  readonly onChange: (
    tabId: string,
  ) => void;
}

/**
 * Tabs component.
 *
 * @param props Component properties.
 * @returns Tabs component.
 */
export function Tabs({
  tabs,
  activeTab,
  onChange,
}: TabsProps): React.JSX.Element {
  const active =
    tabs.find(
      (tab) =>
        tab.id === activeTab,
    );

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex overflow-x-auto border-b border-slate-200">
        {tabs.map((tab) => {
          const selected =
            tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              disabled={
                tab.disabled
              }
              onClick={() =>
                onChange(tab.id)
              }
              className={[
                "whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition",
                selected
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900",
                tab.disabled
                  ? "cursor-not-allowed opacity-50"
                  : "",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-6">
        {active?.content}
      </div>
    </div>
  );
}