import { useMutation } from '@tanstack/react-query';
import { useSatsWagmi } from '../provider';

const useDisconnect = () => {
  const { setConnector } = useSatsWagmi();

  const { error, isError, isIdle, isLoading, isSuccess, mutate, mutateAsync, reset, status, variables } = useMutation({
    mutationKey: ['disconnect'],
    mutationFn: () => {
      setConnector(undefined);
    }
  });

  return {
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    disconnect: mutate,
    disconnectAsync: mutateAsync,
    reset,
    status,
    variables
  };
};

export { useDisconnect };
