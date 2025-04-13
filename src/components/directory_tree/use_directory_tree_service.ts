import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TreeNodeData } from './TreeNode';
import { useCallback, useState } from 'react';

export const useDirectoryTreeService = () => {
    const { data: resp } = useQuery({
        queryKey: ['dir-tree'],
        queryFn: async () => {
            const { data } = await axios.get('http://localhost:3000/data/directory');
            return data;
        },
        select: (resp?: { data: TreeNodeData[] }) => {
            return resp?.data;
        }
    });

    const [dataState, setDataState] = useState(resp);
    if (resp !== dataState) {
        setDataState(resp);
    }

    const addNode = useCallback((parentPath: string, nodeType: 'file' | 'folder', fileType?: string) => {
        setDataState((state) => {
            if (!state) return state;

            const pathParts = parentPath.split('.') as ('children' | `${number}`)[];

            let traversalPointer: TreeNodeData | TreeNodeData[] = state[0];
            for (const pathPart of pathParts) {
                if (
                    !Array.isArray(traversalPointer) &&
                    traversalPointer.nodeType === 'folder' &&
                    pathPart === 'children'
                ) {
                    traversalPointer = traversalPointer[pathPart];
                } else if (Array.isArray(traversalPointer) && pathPart !== 'children') {
                    traversalPointer = traversalPointer[pathPart];
                }
            }

            const parent = traversalPointer as TreeNodeData;
            if (parent.nodeType === 'folder') {
                if (nodeType === 'file') {
                    parent.children = [
                        ...parent.children,
                        { id: crypto.randomUUID(), nodeType, name: 'blah', fileType: fileType ?? 'proc' }
                    ];
                } else {
                    parent.children = [
                        ...parent.children,
                        { id: crypto.randomUUID(), nodeType: nodeType, name: 'blah', children: [] }
                    ];
                }
            }

            return [...state];
        });
    }, []);

    return { treeData: dataState, addNode };
};
