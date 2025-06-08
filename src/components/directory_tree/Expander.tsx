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
    <button onClick={clickHandler} className="w-6 h-6 mr-1">
      {isExpanded ? '-' : '+'}
    </button>
  );
});

export default Expander;
