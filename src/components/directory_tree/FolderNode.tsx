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

const FolderNode: React.FC<{ data: TreeNodeData; level?: number }> = memo(({ data, level = 0 }) => {
  const { name, parentPath } = data;
  const { treeData } = useDirectoryTreeService(`${parentPath}/${name}`);
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = useMemo(() => selectedNode === `${parentPath}/${name}`, [selectedNode, parentPath, name]);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);
  const { addFileMutation, addFolderMutation, deleteFolderMutation } = useTreeNodeMutations();

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
          label: 'Delete',
          action: () => deleteFolderMutation.mutate(`${parentPath}/${name}`)
        }
      ];

      menuItems.push({
        label: 'Add Folder',
        action: () => addFolderMutation.mutate(`${parentPath}/${name}`)
      });
      menuItems.push({
        label: 'Add File',
        action: () => addFileMutation.mutate(`${parentPath}/${name}`)
      });

      contextMenuDispatcher?.({
        type: 'open',
        items: menuItems,
        x: e.clientX + 30,
        y: e.clientY
      });
    },
    [contextMenuDispatcher, deleteFolderMutation, addFolderMutation, addFileMutation, parentPath, name]
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
        {name}
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
    mutationFn: async (path: string) => {
      await axiosClient.delete(`/folder/${encodeURIComponent(path)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree'] });
    }
  });

  const addFolderMutation = useMutation({
    mutationFn: async (parentPath: string) => {
      await axiosClient.put('/folder', {
        folderName: 'default_name',
        parentPath
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree'] });
    }
  });

  const addFileMutation = useMutation({
    mutationFn: async (parentPath: string) => {
      await axiosClient.put('/file', {
        fileName: 'default_file.flow',
        parentPath,
        initialData: 'I am a default file'
      });
    },
    onSuccess: (_, parentPath) => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  return { deleteFolderMutation, addFolderMutation, addFileMutation };
};

export default FolderNode;
