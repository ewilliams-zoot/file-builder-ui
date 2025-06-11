import { memo, useCallback, useContext, useMemo } from 'react';
import { TreeNodeData } from './types';
import { ContextMenuDispatcherContext } from '../context_menu/context_menu_context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FileIcon from './FileIcon';
import { axiosClient } from '../../utils/axios_client';
import { useIsSelectedNode } from './use_is_selected_node';
import { useEditNode } from './use_edit_node';

const FileNode: React.FC<{ data: TreeNodeData; level: number }> = memo(({ data, level }) => {
  const queryClient = useQueryClient();
  const { name, parentPath } = data;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const { isSelected, selectNode } = useIsSelectedNode(`${parentPath}/${name}`);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);
  const { inEditMode, setInEditMode, blurSubmitEdit, enterKeySubmitEdit } = useEditNode(name, parentPath);

  const deleteFileMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/file?path=${encodeURIComponent(`${parentPath}/${name}`)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

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
    [contextMenuDispatcher, deleteFileMutation, setInEditMode]
  );

  return (
    <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
      <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
      <FileIcon />
      {inEditMode ? (
        <input type="text" defaultValue={name} onBlur={blurSubmitEdit} onKeyDown={enterKeySubmitEdit} />
      ) : (
        name
      )}
    </div>
  );
});

export default FileNode;
