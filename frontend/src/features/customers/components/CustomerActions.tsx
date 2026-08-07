/**
 * Customer actions component.
 *
 * Displays available actions
 * for a customer.
 */

import {
  Building2,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  FolderKanban,
} from "lucide-react";

import {
  useState,
} from "react";

/**
 * Component properties.
 */
export interface CustomerActionsProps {
  /**
   * View callback.
   */
  readonly onView?: () => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: () => void;

  /**
   * Manage organizations callback.
   */
  readonly onManageOrganizations?: () => void;

  /**
   * View projects callback.
   */
  readonly onViewProjects?: () => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: () => void;
}

/**
 * Customer actions component.
 *
 * @param props Component properties.
 * @returns Customer actions.
 */
export function CustomerActions({
  onView,
  onEdit,
  onManageOrganizations,
  onViewProjects,
  onDelete,
}: CustomerActionsProps): React.JSX.Element {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-label="Customer actions"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous,
          )
        }
        className="rounded-lg p-2 transition hover:bg-slate-100"
      >
        <MoreVertical
          size={18}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
          {onView ? (
            <ActionButton
              icon={
                <Eye size={18} />
              }
              label="View"
              onClick={() => {
                setOpen(false);
                onView();
              }}
            />
          ) : null}

          {onEdit ? (
            <ActionButton
              icon={
                <Edit size={18} />
              }
              label="Edit"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            />
          ) : null}

          {onManageOrganizations ? (
            <ActionButton
              icon={
                <Building2 size={18} />
              }
              label="Manage Organizations"
              onClick={() => {
                setOpen(false);
                onManageOrganizations();
              }}
            />
          ) : null}

          {onViewProjects ? (
            <ActionButton
              icon={
                <FolderKanban
                  size={18}
                />
              }
              label="View Projects"
              onClick={() => {
                setOpen(false);
                onViewProjects();
              }}
            />
          ) : null}

          {onDelete ? (
            <>
              <hr className="my-2 border-slate-200" />

              <ActionButton
                danger
                icon={
                  <Trash2
                    size={18}
                  />
                }
                label="Delete"
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
  /**
   * Icon.
   */
  readonly icon: React.JSX.Element;

  /**
   * Label.
   */
  readonly label: string;

  /**
   * Click callback.
   */
  readonly onClick: () => void;

  /**
   * Danger action.
   */
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