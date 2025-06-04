import { UseMutateFunction } from '@tanstack/react-query';
import { createContext } from 'react';

export const DeleteFolderContext = createContext<null | UseMutateFunction<void, Error, string, unknown>>(null);
