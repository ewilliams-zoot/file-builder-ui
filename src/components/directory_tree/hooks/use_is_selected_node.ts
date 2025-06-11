import { useCallback, useContext, useMemo } from 'react';
import { SelectedNodeContext } from '../SelectedNodeContext';

export const useIsSelectedNode = (path: string) => {
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const isSelected = useMemo(() => selectedNode === path, [selectedNode, path]);

  const selectNode = useCallback(() => {
    if (!isSelected) {
      setSelectedNode(path);
    }
  }, [isSelected, setSelectedNode, path]);

  return { isSelected, selectNode };
};
