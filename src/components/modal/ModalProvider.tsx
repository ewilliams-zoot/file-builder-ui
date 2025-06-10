import { FC, useReducer } from 'react';
import { ModalStateContext, ModalStateDispatchContext } from './contexts';
import { ModalState, ModalStateAction } from './types';

const ModalProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, modalStateDispatch] = useReducer(modalStateReducer, defaultState);

  return (
    <ModalStateContext.Provider value={modalState}>
      <ModalStateDispatchContext.Provider value={modalStateDispatch}>{children}</ModalStateDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};

const defaultState: ModalState = {
  isOpen: false
};

const modalStateReducer = (state: ModalState, action: ModalStateAction): ModalState => {
  switch (action.type) {
    case 'open':
      return { isOpen: true, render: action.render };
    case 'close':
      return { isOpen: false };
  }
};

export default ModalProvider;
