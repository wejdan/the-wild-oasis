import { useQuery } from "@tanstack/react-query";

export function useCustomQuery(key, queryFn, args = [], options = {}) {
  const { onSuccess, onError, ...restOptions } = options;
  const queryResult = useQuery({
    queryKey: [key, ...args],
    queryFn: () => queryFn(...args, onSuccess),

    ...restOptions,
  });

  // Here, you can add additional properties or methods to the result, if needed.
  // For instance, I'll add a custom `isEmpty` property to check if data is empty.
  const isEmpty = !queryResult.data || queryResult.data.length === 0;

  return {
    ...queryResult, // Spread the entire queryResult
    isEmpty, // Add custom property
  };
}
