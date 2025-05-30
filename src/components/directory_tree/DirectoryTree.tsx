import React from 'react';
import TreeNode, { TreeNodeData } from './TreeNode';
import SelectedNodeProvider from './SelectedNodeProvider';
import { useDirectoryTreeService } from './use_directory_tree_service';
import { DeleteFolderContext } from './DeleteFolderContext';

const DirectoryTree: React.FC = () => {
  const { treeData, deleteFolderMutation } = useDirectoryTreeService();

  if (!treeData) {
    return <p>Loading...</p>;
  }

  return (
    <DeleteFolderContext.Provider value={deleteFolderMutation.mutate}>
      <SelectedNodeProvider>
        <div className="directory-tree">
          <TreeNode key="root" data={{ nodeType: 'file', fileType: 'root', id: 'root', name: 'Project Root' }} />
          {treeData.map((treeData: TreeNodeData) => (
            <TreeNode key={treeData.id} data={treeData} level={1} />
          ))}
        </div>
      </SelectedNodeProvider>
    </DeleteFolderContext.Provider>
  );
};

export default DirectoryTree;
