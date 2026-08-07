/**
 * Delete role dialog component.
 *
 * Displays a confirmation dialog
 * before permanently deleting a role.
 */

import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

import {
  Button,
  Modal,
} from "../../../components/ui";



/**
 * Component properties.
 */
export interface DeleteRoleDialogProps {


  /**
   * Indicates whether dialog is open.
   */
  readonly open: boolean;



  /**
   * Role name.
   */
  readonly roleName?: string;



  /**
   * Close callback.
   */
  readonly onClose: () => void;



  /**
   * Confirm callback.
   */
  readonly onConfirm: () => void | Promise<void>;



  /**
   * Deleting state.
   */
  readonly isDeleting?: boolean;

}



/**
 * Delete role dialog component.
 *
 * @param props Component properties.
 * @returns Delete role dialog.
 */
export function DeleteRoleDialog({
  open,
  roleName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteRoleDialogProps): React.JSX.Element {


  return (

    <Modal

      open={
        open
      }

      onClose={
        onClose
      }

      title="Delete Role"

    >

      <div
        className="space-y-6"
      >


        <div
          className="flex items-start gap-4"
        >

          <div

            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"

          >

            <AlertTriangle
              size={24}
            />

          </div>



          <div>

            <h3

              className="text-lg font-semibold text-slate-900"

            >

              Delete Role

            </h3>



            <p

              className="mt-2 text-sm text-slate-600"

            >

              Are you sure you want to delete{" "}

              <span
                className="font-semibold"
              >

                {
                  roleName ??
                  "this role"
                }

              </span>

              ?

            </p>



            <p

              className="mt-2 text-sm text-red-600"

            >

              This action cannot be undone.

            </p>



            <p

              className="mt-2 text-sm text-slate-500"

            >

              Deleting a role may affect assigned permissions and user access.

            </p>

          </div>


        </div>



        <div

          className="flex justify-end gap-3"

        >

          <Button

            type="button"

            variant="secondary"

            onClick={
              onClose
            }

            disabled={
              isDeleting
            }

          >

            Cancel

          </Button>



          <Button

            type="button"

            variant="danger"

            loading={
              isDeleting
            }

            onClick={() => {

              void onConfirm();

            }}

          >

            <Trash2
              size={16}
            />

            Delete Role

          </Button>


        </div>


      </div>


    </Modal>

  );

}