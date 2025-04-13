import { useCallback, useContext, useEffect, useRef } from 'react';
import { ContextMenuDispatcherContext, ContextMenuStateContext } from './context_menu_context';
import { ContextMenuItem } from './types';
import './ContextMenu.css';

const ContextMenu = () => {
  const state = useContext(ContextMenuStateContext)!;
  const dispatcher = useContext(ContextMenuDispatcherContext)!;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    isOpen,
    items,
    pos: { x, y },
  } = state;

  const runAction = useCallback(
    (action: ContextMenuItem['action']) => {
      action();
      dispatcher({ type: 'close' });
    },
    [dispatcher]
  );

  useEffect(() => {
    if (isOpen) {
      const clickAwayHandler = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
          dispatcher({ type: 'close' });
        }
      };
      window.addEventListener('click', clickAwayHandler);

      return () => {
        window.removeEventListener('click', clickAwayHandler);
      };
    }
  }, [isOpen, dispatcher]);

  return (
    isOpen && (
      <div
        ref={menuRef}
        className="context-menu"
        style={{ left: `${x}px`, top: `${y}px`}}>
        {items.map(({ label, action }, i) => (
          <p key={`${label}-${i}`} onClick={() => runAction(action)} className="menu-item">
            {label}
          </p>
        ))}
      </div>
    )
  );
};

export default ContextMenu;
