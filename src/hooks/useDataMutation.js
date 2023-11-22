import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDataMutation = (
  mutationFn,
  queryKey,
  onSuccessCallback,
  onErrorCallback
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ active: true });

      if (onSuccessCallback) {
        onSuccessCallback(); // Direct function call
      }
    },
    onError: (err) => {
      if (onErrorCallback) {
        onErrorCallback(err);
      }
    },
  });
};

export default useDataMutation;
