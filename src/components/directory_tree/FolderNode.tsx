import { memo, useCallback, useContext, useMemo, useState } from 'react';
import Expander from './Expander';
import { SelectedNodeContext } from './SelectedNodeContext';
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

const FolderNode: React.FC<{ data: TreeNodeData; level?: number }> = memo(({ data, level = 0 }) => {
  const { name, parentPath } = data;
  const { treeData } = useDirectoryTreeService(`${parentPath}/${name}`);
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const modalDispatch = useRequiredContext(ModalStateDispatchContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = useMemo(() => selectedNode === `${parentPath}/${name}`, [selectedNode, parentPath, name]);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);
  const { addFileMutation, addFolderMutation, deleteFolderMutation, renameFolderMutation } = useTreeNodeMutations();
  const [inEditMode, setInEditMode] = useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((ex) => !ex);
  }, []);

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
          label: 'Rename',
          action: () => setInEditMode(true)
        },
        {
          label: 'Add Folder',
          action: () => addFolderMutation.mutate(`${parentPath}/${name}`)
        },
        {
          label: 'Add File',
          action: () => {
            modalDispatch({
              type: 'open',
              render: () => (
                <NewFileModal
                  onDone={(fileType, fileName) => {
                    addFileMutation.mutate({ parentPath: `${parentPath}/${name}`, fileType, fileName });
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
          action: () => deleteFolderMutation.mutate({ parentPath, name })
        }
      ];

      contextMenuDispatcher?.({
        type: 'open',
        items: menuItems,
        x: e.clientX + 30,
        y: e.clientY
      });
    },
    [contextMenuDispatcher, deleteFolderMutation, addFolderMutation, addFileMutation, parentPath, name, modalDispatch]
  );

  const editName: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.target.value !== name) {
        renameFolderMutation.mutate({ parentPath, name, newName: e.target.value });
      }
      setInEditMode(false);
    },
    [name, parentPath, renameFolderMutation]
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
        {inEditMode ? <input type="text" defaultValue={name} onBlur={editName} /> : name}
      </div>
      {isExpanded &&
        treeData.map((childData) =>
          childData.nodeType === 'folder' ? (
            <FolderNode key={childData.name} data={childData} level={level + 1} />
          ) : (
            <FileNode key={childData.name} data={childData} level={level + 1} />
          )
        )}
    </>
  );
});

const useTreeNodeMutations = () => {
  const queryClient = useQueryClient();

  const deleteFolderMutation = useMutation({
    mutationFn: async ({ parentPath, name }: { parentPath: string; name: string }) => {
      await axiosClient.delete(`/folder?path=${encodeURIComponent(`${parentPath}/${name}`)}`);
    },
    onSuccess: (_, { parentPath }) => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const addFolderMutation = useMutation({
    mutationFn: async (parentPath: string) => {
      await axiosClient.put('/folder', {
        folderName: 'default_name',
        parentPath
      });
    },
    onSuccess: (_, parentPath) => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const addFileMutation = useMutation({
    mutationFn: async ({
      parentPath,
      fileType,
      fileName = 'default_file'
    }: {
      parentPath: string;
      fileType: 'flow' | 'js';
      fileName?: string;
    }) => {
      if (fileName === '') fileName = 'default_file';

      await axiosClient.put('/file', {
        fileName: `${fileName}.${fileType}`,
        parentPath,
        initialData: 'I am a default file'
      });
    },
    onSuccess: (_, { parentPath }) => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const renameFolderMutation = useMutation({
    mutationFn: async ({ parentPath, name, newName }: { parentPath: string; name: string; newName: string }) => {
      await axiosClient.patch(
        `/folder?path=${encodeURIComponent(`${parentPath}/${name}`)}&newPath=${encodeURIComponent(
          `${parentPath}/${newName}`
        )}`
      );
    },
    onSuccess: (_, { parentPath }) => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  return { deleteFolderMutation, addFolderMutation, addFileMutation, renameFolderMutation };
};

export default FolderNode;
