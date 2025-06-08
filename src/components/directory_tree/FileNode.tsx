import { memo, useCallback, useContext, useMemo } from 'react';
import { TreeNodeData } from './types';
import { SelectedNodeContext } from './SelectedNodeContext';
import { ContextMenuDispatcherContext } from '../context_menu/context_menu_context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import FileIcon from './FileIcon';

const FileNode: React.FC<{ data: TreeNodeData; level?: number }> = memo(({ data, level = 0 }) => {
  const queryClient = useQueryClient();
  const { name, parentPath } = data;
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const isSelected = useMemo(() => selectedNode === `${parentPath}/${name}`, [selectedNode, parentPath, name]);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/file?path=${encodeURIComponent(parentPath + name)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const selectNode = useCallback(() => {
    if (!isSelected) {
      setSelectedNode(`${parentPath}/${name}`);
    }
  }, [isSelected, setSelectedNode, parentPath, name]);

  const openContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const menuItems = [
        {
          label: 'Delete',
          action: () => deleteFileMutation.mutate()
        }
      ];

      contextMenuDispatcher?.({
        type: 'open',
        items: menuItems,
        x: e.clientX + 30,
        y: e.clientY
      });
    },
    [contextMenuDispatcher, deleteFileMutation]
  );

  return (
    <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
      <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
      <FileIcon />
      {name}
    </div>
  );
});

export default FileNode;
