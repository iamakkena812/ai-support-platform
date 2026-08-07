/**
 * Project error component.
 *
 * Displays an error message when projects
 * cannot be loaded.
 */


/**
 * Component properties.
 */
interface ProjectErrorProps {

  /**
   * Error message.
   */
  readonly message: string;

}


/**
 * Project error.
 *
 * @param props Component properties.
 * @returns Project error component.
 */
export function ProjectError(
  {
    message,
  }: ProjectErrorProps,
): React.JSX.Element {

  return (

    <div
      className="rounded-lg border border-red-200 bg-red-50 p-6"
    >

      <h2
        className="text-lg font-semibold text-red-700"
      >
        Unable to load projects
      </h2>


      <p
        className="mt-2 text-sm text-red-600"
      >
        {
          message
        }
      </p>

    </div>

  );

}