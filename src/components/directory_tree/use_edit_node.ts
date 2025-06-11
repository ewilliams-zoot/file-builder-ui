import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { axiosClient } from '../../utils/axios_client';

export const useEditNode = (name: string, parentPath: string) => {
  const [inEditMode, setInEditMode] = useState(false);
  const queryClient = useQueryClient();

  const renameMutation = useMutation({
    mutationFn: async (newName: string) => {
      await axiosClient.patch(
        `/file?path=${encodeURIComponent(`${parentPath}/${name}`)}&newPath=${encodeURIComponent(
          `${parentPath}/${newName}`
        )}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dir-tree', parentPath] });
    }
  });

  const submitEdit = useCallback(
    (value: string) => {
      if (value !== name) {
        renameMutation.mutate(value);
      }
      setInEditMode(false);
    },
    [name, renameMutation]
  );

  const blurSubmitEdit: React.FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      submitEdit(e.target.value);
    },
    [submitEdit]
  );

  const enterKeySubmitEdit: React.KeyboardEventHandler = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        submitEdit((e.target as HTMLInputElement).value);
      }
    },
    [submitEdit]
  );

  return { inEditMode, setInEditMode, enterKeySubmitEdit, blurSubmitEdit };
};
