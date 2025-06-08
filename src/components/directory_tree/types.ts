export type TreeNodeData =
  | {
      id: string;
      name: string;
      nodeType: 'file';
      fileType: string;
      parentPath: string;
    }
  | {
      id: string;
      name: string;
      nodeType: 'folder';
      children: TreeNodeData[];
      parentPath: string;
    };
