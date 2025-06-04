import { useContext } from 'react';

export const useRequiredContext = <TData>(context: React.Context<TData>): NonNullable<TData> => {
  const contextValue = useContext(context);

  if (contextValue === null || contextValue === undefined) {
    throw new Error('You are missing a context above this hook usage');
  }

  return contextValue;
};
