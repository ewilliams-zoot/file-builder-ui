import { memo, useState } from 'react';
import { SelectedNodeContext } from './SelectedNodeContext';

const SelectedNodeProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [selectedNode, setSelectedNode] = useState('');
  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>{children}</SelectedNodeContext.Provider>
  );
});

export default SelectedNodeProvider;
