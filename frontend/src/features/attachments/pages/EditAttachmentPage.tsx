/**
 * Edit attachment page.
 */

import { useNavigate, useParams } from "react-router-dom";

import { AttachmentForm } from "../components/AttachmentForm";
import { useAttachment } from "../hooks/useAttachment";
import { useUpdateAttachment } from "../hooks/useAttachments";

import type { AttachmentFormValues } from "../components/AttachmentForm";

/**
 * Edit attachment page.
 */
export function EditAttachmentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const { attachmentId = "" } = useParams<{
    attachmentId: string;
  }>();

  const {
    data: attachment,
    isLoading,
    isError,
    error,
  } = useAttachment(
    attachmentId,
  );

  const updateAttachmentMutation =
    useUpdateAttachment();

  /**
   * Handles attachment update.
   *
   * @param values - Attachment form values.
   */
  const handleSubmit = async (
    values: AttachmentFormValues,
  ): Promise<void> => {
    await updateAttachmentMutation.mutateAsync(
      {
        attachmentId,
        payload: {
          fileName:
            values.fileName,
        },
      },
    );

    navigate(
      "/attachments",
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading attachment...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error instanceof Error
          ? error.message
          : "Failed to load attachment."}
      </div>
    );
  }

  if (!attachment) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
        Attachment not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Attachment
        </h1>

        <p className="mt-2 text-gray-600">
          Update attachment
          information.
        </p>
      </header>

      <AttachmentForm
        initialValue={
          attachment
        }
        onSubmit={
          handleSubmit
        }
        isSubmitting={
          updateAttachmentMutation.isPending
        }
      />
    </div>
  );
}