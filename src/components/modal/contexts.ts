import { createContext } from 'react';
import { ModalState, ModalStateAction } from './types';

export const ModalStateContext = createContext<ModalState | null>(null);
export const ModalStateDispatchContext = createContext<React.ActionDispatch<[action: ModalStateAction]> | null>(null);
