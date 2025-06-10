import { FC } from 'react';
import { useRequiredContext } from '../../utils/use_required_context';
import { ModalStateContext } from './contexts';

const Modal: FC = () => {
  const modalState = useRequiredContext(ModalStateContext);

  return (
    modalState.isOpen && (
      <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black/10">
        <div className="w-full h-full max-w-200 max-h-100 bg-white shadow-lg rounded-lg overflow-auto p-3">
          {modalState.render()}
        </div>
      </div>
    )
  );
};

export default Modal;
