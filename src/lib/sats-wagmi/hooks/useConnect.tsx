import { SatsConnector } from '../connectors/base';
import { useSatsWagmi } from '../provider';
import { useMutation } from '@tanstack/react-query';

const useConnect = () => {
  const { connectors, setConnector } = useSatsWagmi();

  const { data, error, isError, isIdle, isLoading, isSuccess, mutate, mutateAsync, reset, status, variables } =
    useMutation({
      mutationKey: ['connect'],
      mutationFn: ({ connector }: { connector?: SatsConnector }) => {
        if (!connector) {
          throw new Error('invalid connector id');
        }
        setConnector(connector);
        return connector.connect();
      }
    });

  return {
    connectors,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    connect: mutate,
    connectAsync: mutateAsync,
    reset,
    status,
    variables
  };
};

export { useConnect };
