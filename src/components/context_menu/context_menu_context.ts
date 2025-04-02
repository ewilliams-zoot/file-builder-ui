import { createContext } from 'react';
import { ContextMenuAction, ContextMenuState } from './types';

export const ContextMenuStateContext = createContext<ContextMenuState | null>(null);

export const ContextMenuDispatcherContext = createContext<React.ActionDispatch<[action: ContextMenuAction]> | null>(
  null
);
