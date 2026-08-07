/**
 * Organization actions component.
 *
 * Displays the available actions
 * for an organization.
 */

import {
  Edit,
  Eye,
  MoreVertical,
  Settings,
  Trash2,
} from "lucide-react";

import { useState } from "react";

/**
 * Component properties.
 */
export interface OrganizationActionsProps {
  /**
   * View callback.
   */
  readonly onView?: () => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: () => void;

  /**
   * Settings callback.
   */
  readonly onSettings?: () => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: () => void;
}

/**
 * Organization actions.
 *
 * @param props Component properties.
 * @returns Organization actions component.
 */
export function OrganizationActions({
  onView,
  onEdit,
  onSettings,
  onDelete,
}: OrganizationActionsProps): React.JSX.Element {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous,
          )
        }
        className="rounded-lg p-2 transition hover:bg-slate-100"
        aria-label="Organization actions"
      >
        <MoreVertical size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
          {onView ? (
            <ActionButton
              icon={<Eye size={18} />}
              label="View"
              onClick={() => {
                setOpen(false);
                onView();
              }}
            />
          ) : null}

          {onEdit ? (
            <ActionButton
              icon={<Edit size={18} />}
              label="Edit"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            />
          ) : null}

          {onSettings ? (
            <ActionButton
              icon={
                <Settings
                  size={18}
                />
              }
              label="Settings"
              onClick={() => {
                setOpen(false);
                onSettings();
              }}
            />
          ) : null}

          {onDelete ? (
            <>
              <hr className="my-2 border-slate-200" />

              <ActionButton
                icon={
                  <Trash2
                    size={18}
                  />
                }
                label="Delete"
                danger
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
              />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Action button properties.
 */
interface ActionButtonProps {
  readonly icon: React.JSX.Element;
  readonly label: string;
  readonly onClick: () => void;
  readonly danger?: boolean;
}

/**
 * Action button.
 *
 * @param props Component properties.
 * @returns Action button.
 */
function ActionButton({
  icon,
  label,
  onClick,
  danger = false,
}: ActionButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-100",
      ].join(" ")}
    >
      {icon}

      {label}
    </button>
  );
}