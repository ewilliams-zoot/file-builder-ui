import { memo, useCallback } from 'react';

const Expander: React.FC<{ isExpanded: boolean; onToggled: () => void }> = memo(({ isExpanded, onToggled }) => {
  const clickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onToggled();
    },
    [onToggled]
  );

  return (
    <button onClick={clickHandler} className="expander">
      {isExpanded ? '-' : '+'}
    </button>
  );
});

export default Expander;
