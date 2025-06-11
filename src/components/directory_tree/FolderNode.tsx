import { memo, useCallback, useContext, useMemo, useState } from 'react';
import Expander from './Expander';
import { ContextMenuDispatcherContext } from '../context_menu/context_menu_context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import FolderIcon from './FolderIcon';
import { useDirectoryTreeService } from './use_directory_tree_service';
import { TreeNodeData } from './types';
import { axiosClient } from '../../utils/axios_client';
import FileNode from './FileNode';
import { useRequiredContext } from '../../utils/use_required_context';
import { ModalStateDispatchContext } from '../modal/contexts';
import NewFileModal from '../modal/views/NewFileModal';
import { useIsSelectedNode } from './use_is_selected_node';
import { useEditNode } from './use_edit_node';

const FolderNode: React.FC<{ data: TreeNodeData; level?: number }> = memo(({ data, level = 0 }) => {
  const { name, parentPath } = data;
  const { treeData } = useDirectoryTreeService(`${parentPath}/${name}`);
  const { isSelected, selectNode } = useIsSelectedNode(`${parentPath}/${name}`);
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const modalDispatch = useRequiredContext(ModalStateDispatchContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);
  const { addFileMutation, addFolderMutation, deleteFolderMutation } = useTreeNodeMutations(parentPath, name);
  const { inEditMode, setInEditMode, blurSubmitEdit, enterKeySubmitEdit } = useEditNode(name, parentPath);

  const toggleExpand = useCallback(() => {
    setIsExpanded((ex) => !ex);
  }, []);

  const openContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const menuItems = [
        {
          label: 'Rename',
          action: () => setInEditMode(true)
        },
        {
          label: 'Add Folder',
          action: () => addFolderMutation.mutate()
        },
        {
          label: 'Add File',
          action: () => {
            modalDispatch({
              type: 'open',
              render: () => (
                <NewFileModal
                  onDone={(fileType, fileName) => {
                    addFileMutation.mutate({ fileType, fileName });
                    modalDispatch({ type: 'close' });
                  }}
                  onCancel={() => modalDispatch({ type: 'close' })}
                />
              )
            });
          }
        },
        {
          label: 'Delete',
          action: () => deleteFolderMutation.mutate()
        }
      ];

      contextMenuDispatcher?.({
        type: 'open',
        items: menuItems,
        x: e.clientX + 30,
        y: e.clientY
      });
    },
    [contextMenuDispatcher, deleteFolderMutation, addFolderMutation, addFileMutation, modalDispatch, setInEditMode]
  );

  if (!treeData) {
    return <div>...Loading</div>;
  }

  return (
    <>
      <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
        <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
        <FolderIcon />
        {treeData.length > 0 ? (
          <Expander onToggled={toggleExpand} isExpanded={isExpanded} />
        ) : (
          <div className="w-7"></div> /* Spacing for expander */
        )}
        {inEditMode ? (
          <input type="text" defaultValue={name} onBlur={blurSubmitEdit} onKeyDown={enterKeySubmitEdit} />
        ) : (
          name
        )}
      </div>
      {isExpanded &&
        treeData
          .filter(({ nodeType }) => nodeType === 'folder')
          .map((childData) => <FolderNode key={childData.name} data={childData} level={level + 1} />)}
      {isExpanded &&
        treeData
          .filter(({ nodeType }) => nodeType === 'file')
          .map((childData) => <FileNode key={childData.name} data={childData} level={level + 1} />)}
    </>
  );
});

const useTreeNodeMutations = (parentPath: string, name: string) => {
  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.delete(`/folder?path=${encodeURIComponent(`${parentPath}/${name}`)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const addFolderMutation = useMutation({
    mutationFn: async () => {
      await axiosClient.put('/folder', {
        folderName: 'default_name',
        parentPath: `${parentPath}/${name}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', `${parentPath}/${name}`] });
    }
  });

  const addFileMutation = useMutation({
    mutationFn: async ({ fileType, fileName = 'default_file' }: { fileType: 'flow' | 'js'; fileName?: string }) => {
      if (fileName === '') fileName = 'default_file';

      await axiosClient.put('/file', {
        fileName: `${fileName}.${fileType}`,
        parentPath: `${parentPath}/${name}`,
        initialData: 'I am a default file'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', `${parentPath}/${name}`] });
    }
  });

  return { deleteFolderMutation, addFolderMutation, addFileMutation };
};

export default FolderNode;
