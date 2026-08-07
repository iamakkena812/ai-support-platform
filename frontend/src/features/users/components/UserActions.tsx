/**
 * User actions component.
 *
 * Displays the available actions
 * for a user.
 */

import {
  Edit,
  Eye,
  KeyRound,
  MoreVertical,
  Shield,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

/**
 * Component properties.
 */
export interface UserActionsProps {
  /**
   * View callback.
   */
  readonly onView?: () => void;

  /**
   * Edit callback.
   */
  readonly onEdit?: () => void;

  /**
   * Manage roles callback.
   */
  readonly onManageRoles?: () => void;

  /**
   * Reset password callback.
   */
  readonly onResetPassword?: () => void;

  /**
   * Delete callback.
   */
  readonly onDelete?: () => void;
}

/**
 * User actions component.
 *
 * @param props Component properties.
 * @returns User actions component.
 */
export function UserActions({
  onView,
  onEdit,
  onManageRoles,
  onResetPassword,
  onDelete,
}: UserActionsProps): React.JSX.Element {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        aria-label="User actions"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous,
          )
        }
        className="rounded-lg p-2 transition hover:bg-slate-100"
      >
        <MoreVertical size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
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

          {onManageRoles ? (
            <ActionButton
              icon={
                <Shield
                  size={18}
                />
              }
              label="Manage Roles"
              onClick={() => {
                setOpen(false);
                onManageRoles();
              }}
            />
          ) : null}

          {onResetPassword ? (
            <ActionButton
              icon={
                <KeyRound
                  size={18}
                />
              }
              label="Reset Password"
              onClick={() => {
                setOpen(false);
                onResetPassword();
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