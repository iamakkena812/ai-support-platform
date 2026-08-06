/**
 * Create attachment page.
 */

import { useNavigate } from "react-router-dom";

import {
  AttachmentForm,
} from "../components/AttachmentForm";
import {
  useCreateAttachment,
} from "../hooks/useAttachments";

import type {
  AttachmentFormValues,
} from "../components/AttachmentForm";

/**
 * Create attachment page.
 */
export function CreateAttachmentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const createAttachmentMutation =
    useCreateAttachment();

  /**
   * Handles attachment creation.
   *
   * @param values - Attachment form values.
   */
  const handleSubmit = async (
    values: AttachmentFormValues,
  ): Promise<void> => {
    if (
      !values.ticketId ||
      !values.file
    ) {
      return;
    }

    await createAttachmentMutation.mutateAsync(
      {
        ticketId:
          values.ticketId,
        file: values.file,
      },
    );

    navigate(
      "/attachments",
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Upload
          Attachment
        </h1>

        <p className="mt-2 text-gray-600">
          Upload a new
          attachment for a
          support ticket.
        </p>
      </header>

      <AttachmentForm
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          createAttachmentMutation.isPending
        }
      />
    </div>
  );
}