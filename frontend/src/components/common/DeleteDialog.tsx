/**
 * Delete dialog component.
 *
 * Displays a reusable delete confirmation dialog.
 */

import { ConfirmDialog } from "./ConfirmDialog";

/**
 * Component properties.
 */
export interface DeleteDialogProps {
  /**
   * Entity name.
   */
  readonly entityName: string;

  /**
   * Dialog visibility.
   */
  readonly open: boolean;

  /**
   * Loading state.
   */
  readonly isLoading?: boolean;

  /**
   * Delete confirmation.
   */
  readonly onConfirm: () => void;

  /**
   * Cancel action.
   */
  readonly onCancel: () => void;
}

/**
 * Delete dialog.
 *
 * @param props Component properties.
 * @returns Delete dialog.
 */
export function DeleteDialog({
  entityName,
  open,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteDialogProps): React.JSX.Element {
  return (
    <ConfirmDialog
      title={`Delete ${entityName}`}
      message={`Are you sure you want to delete this ${entityName.toLowerCase()}? This action cannot be undone.`}
      open={open}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}