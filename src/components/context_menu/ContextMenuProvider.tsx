import { useReducer } from 'react';
import { ContextMenuStateContext, ContextMenuDispatcherContext } from './context_menu_context';
import { ContextMenuAction, ContextMenuState } from './types';

const defaultMenuState: ContextMenuState = { isOpen: false, items: [], pos: { x: 0, y: 0 } };

const ContextMenuProvider = ({ children }: { children?: React.ReactNode }) => {
  const [menuState, menuDispatch] = useReducer(contextMenuReducer, defaultMenuState);

  return (
    <ContextMenuStateContext.Provider value={menuState}>
      <ContextMenuDispatcherContext.Provider value={menuDispatch}>{children}</ContextMenuDispatcherContext.Provider>
    </ContextMenuStateContext.Provider>
  );
};

const contextMenuReducer = (_state: ContextMenuState, action: ContextMenuAction): ContextMenuState => {
  switch (action.type) {
    case 'open': {
      return { isOpen: true, items: action.items, pos: { x: action.x, y: action.y } };
    }
    case 'close':
      return defaultMenuState;
  }
};

export default ContextMenuProvider;
