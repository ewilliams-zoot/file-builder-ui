import React, { useState } from 'react';
import TreeNode, { TreeNodeData } from './TreeNode';
import SelectedNodeProvider from './SelectedNodeProvider';
import { useDirectoryTreeService } from './use_directory_tree_service';

const DirectoryTree: React.FC = () => {
  const { treeData, addNode } = useDirectoryTreeService();

  if (!treeData) {
    return <p>Loading...</p>;
  }

  return (
    <SelectedNodeProvider>
      <div className="directory-tree">
        <TreeNode key="root" data={{ nodeType: 'file', fileType: 'root', id: 'root', name: 'Project Root' }} />
        {treeData.map((treeData: TreeNodeData) => (
          <TreeNode key={treeData.id} data={treeData} level={1} />
        ))}
      </div>
    </SelectedNodeProvider>
  );
};

export default DirectoryTree;
