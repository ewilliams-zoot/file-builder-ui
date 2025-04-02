export interface ContextMenuState {
  isOpen: boolean;
  pos: {
    x: number;
    y: number;
  };
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  label: string;
  action: () => void;
}

export type ContextMenuAction =
  | {
      type: 'open';
      items: ContextMenuState['items'];
      x: ContextMenuState['pos']['x'];
      y: ContextMenuState['pos']['y'];
    }
  | {
      type: 'close';
    };
