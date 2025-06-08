import React from 'react';
import FolderNode from './FolderNode';
import SelectedNodeProvider from './SelectedNodeProvider';
import { useDirectoryTreeService } from './use_directory_tree_service';
import { TreeNodeData } from './types';
import FileNode from './FileNode';

const DirectoryTree: React.FC = () => {
  const { treeData } = useDirectoryTreeService('data');

  if (!treeData) {
    return <p>Loading...</p>;
  }

  return (
    <SelectedNodeProvider>
      <div className="directory-tree">
        <div>Project Root</div>
        {treeData.map((treeData: TreeNodeData) =>
          treeData.nodeType === 'folder' ? (
            <FolderNode key={treeData.name} data={treeData} level={1} />
          ) : (
            <FileNode key={treeData.name} data={treeData} level={1} />
          )
        )}
      </div>
    </SelectedNodeProvider>
  );
};

export default DirectoryTree;
