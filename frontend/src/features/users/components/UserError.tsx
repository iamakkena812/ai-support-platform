/**
 * User error component.
 *
 * Displays an error message when users
 * cannot be loaded.
 */

interface UserErrorProps {

  /**
   * Error message.
   */
  readonly message: string;
}


/**
 * User error.
 *
 * @param props Component properties.
 * @returns User error component.
 */
export function UserError(
  {
    message,
  }: UserErrorProps,
): React.JSX.Element {

  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 p-4"
    >

      <h2
        className="text-sm font-semibold text-red-700"
      >
        Unable to load user
      </h2>


      <p
        className="mt-1 text-sm text-red-600"
      >
        {message}
      </p>

    </div>
  );
}