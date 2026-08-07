/**
 * Edit attachment page.
 */

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  AttachmentForm,
} from "../components/AttachmentForm";

import {
  useAttachment,
} from "../hooks/useAttachment";

import {
  useUpdateAttachment,
} from "../hooks/useAttachments";

import type {
  AttachmentFormValues,
} from "../components/AttachmentForm";

/**
 * Edit attachment page.
 */
export function EditAttachmentPage(): React.JSX.Element {
  const navigate = useNavigate();

  const {
    attachmentId = "",
  } = useParams<{
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
   * @param values Attachment form values.
   */
  const handleSubmit = async (
    values: AttachmentFormValues,
  ): Promise<void> => {
    await updateAttachmentMutation.mutateAsync(
      {
        id: attachmentId,
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
      <div>
        Loading attachment...
      </div>
    );
  }


  if (isError) {
    return (
      <div>
        {error instanceof Error
          ? error.message
          : "Failed to load attachment."}
      </div>
    );
  }


  if (!attachment) {
    return (
      <div>
        Attachment not found.
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Attachment
        </h1>

        <p className="mt-2 text-gray-600">
          Update attachment information.
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