import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TreeNodeData } from './TreeNode';

export const useDirectoryTreeService = () => {
  const { data: treeData } = useQuery({
    queryKey: ['dir-tree'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/api/directory');
      return data;
    },
    select: (resp?: { data: TreeNodeData[] }) => {
      return resp?.data;
    }
  });

  return { treeData };
};
