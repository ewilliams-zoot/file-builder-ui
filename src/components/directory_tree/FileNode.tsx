import { memo, useCallback, useContext, useMemo, useState } from 'react';
import { TreeNodeData } from './types';
import { SelectedNodeContext } from './SelectedNodeContext';
import { ContextMenuDispatcherContext } from '../context_menu/context_menu_context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FileIcon from './FileIcon';
import { axiosClient } from '../../utils/axios_client';

const FileNode: React.FC<{ data: TreeNodeData; level: number }> = memo(({ data, level }) => {
  const queryClient = useQueryClient();
  const { name, parentPath } = data;
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const isSelected = useMemo(() => selectedNode === `${parentPath}/${name}`, [selectedNode, parentPath, name]);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);
  const [inEditMode, setInEditMode] = useState(false);

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/file?path=${encodeURIComponent(`${parentPath}/${name}`)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const renameFileMutation = useMutation({
    mutationFn: async (newName: string) => {
      await axiosClient.patch(
        `/file?path=${encodeURIComponent(`${parentPath}/${name}`)}&newPath=${encodeURIComponent(
          `${parentPath}/${newName}`
        )}`
      );
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
          label: 'Edit',
          action: () => setInEditMode(true)
        },
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

  const editName: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.value !== name) {
        renameFileMutation.mutate(e.target.value);
      }
      setInEditMode(false);
    },
    [renameFileMutation, name]
  );

  return (
    <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
      <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
      <FileIcon />
      {inEditMode ? <input type="text" defaultValue={name} onBlur={editName} /> : name}
    </div>
  );
});

export default FileNode;
