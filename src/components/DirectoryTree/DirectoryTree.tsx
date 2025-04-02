import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import TreeNode, { TreeNodeData } from './TreeNode';
import SelectedNodeProvider from './SelectedNodeProvider';

const DirectoryTree: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['dir-tree'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/data/directory');
      return data;
    },
  });

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <SelectedNodeProvider>
      <div className="directory-tree">
        <TreeNode key="root" data={{ nodeType: 'file', fileType: 'root', id: 'root', name: 'Project Root' }} />
        {data?.data.map((treeData: TreeNodeData) => (
          <TreeNode key={treeData.id} data={treeData} level={1} />
        ))}
      </div>
    </SelectedNodeProvider>
  );
};

export default DirectoryTree;
