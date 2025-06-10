export type ModalState =
  | {
      isOpen: false;
      render?: never;
    }
  | {
      isOpen: true;
      render: () => React.ReactElement;
    };

export type ModalStateAction =
  | {
      type: 'open';
      render: () => React.ReactElement;
    }
  | {
      type: 'close';
    };
