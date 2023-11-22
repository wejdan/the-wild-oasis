function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="bg-white rounded-lg p-6 m-4 shadow-md flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Oops, something went wrong!
      </h2>
      <p className="text-gray-600 mb-3">
        The error has been reported to our team. Please try reloading the page.
      </p>
      <pre className="bg-red-100 text-red-800 p-3 rounded mb-4">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Try Again
      </button>
    </div>
  );
}
export default ErrorFallback;
