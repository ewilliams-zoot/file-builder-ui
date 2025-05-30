import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TreeNodeData } from './TreeNode';

export const useDirectoryTreeService = () => {
  const queryClient = useQueryClient();

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

  const deleteFolderMutation = useMutation({
    mutationFn: async (path: string) => {
      await axios.delete(`http://localhost:3000/api/folder/${encodeURIComponent(path)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree'] });
    }
  });

  return { treeData, deleteFolderMutation };
};
