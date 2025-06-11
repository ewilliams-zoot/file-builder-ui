import { useQuery } from '@tanstack/react-query';
import { TreeNodeData } from './types';
import { axiosClient } from '../../utils/axios_client';

export const useDirectoryTreeService = (dirEntryPath: string) => {
  const { data: treeData } = useQuery({
    queryKey: ['dir-tree', dirEntryPath],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/directory?path=${encodeURIComponent(dirEntryPath)}`);
      return data;
    },
    select: (resp?: { data: TreeNodeData[] }) => {
      return resp?.data;
    }
  });

  return { treeData };
};
