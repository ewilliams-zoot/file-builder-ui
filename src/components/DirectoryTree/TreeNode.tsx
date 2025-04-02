import { memo, useCallback, useContext, useMemo, useState } from 'react';
import Expander from './Expander';
import { SelectedNodeContext } from './SelectedNodeContext';
import { ContextMenuDispatcherContext } from '../context_menu/context_menu_context';

export type TreeNodeData =
  | {
      id: string;
      name: string;
      nodeType: 'file';
      fileType: string;
    }
  | {
      id: string;
      name: string;
      nodeType: 'folder';
      children: TreeNodeData[];
    };

const TreeNode: React.FC<{ data: TreeNodeData; level?: number }> = memo(({ data, level = 0 }) => {
  const { nodeType, name } = data;
  const { selectedNode, setSelectedNode } = useContext(SelectedNodeContext)!;
  const contextMenuDispatcher = useContext(ContextMenuDispatcherContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = useMemo(() => selectedNode === data.id, [selectedNode, data.id]);
  const classStr = useMemo(() => `directory-row ${isSelected ? 'selected' : ''}`, [isSelected]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((ex) => !ex);
  }, []);

  const selectNode = useCallback(() => {
    if (!isSelected) {
      setSelectedNode(data.id);
    }
  }, [isSelected, setSelectedNode, data.id]);

  const openContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      contextMenuDispatcher?.({
        type: 'open',
        items: [
          {
            label: 'hello',
            action: () => console.log('hello'),
          },
          {
            label: 'there',
            action: () => console.log('there'),
          },
        ],
        x: e.clientX + 30,
        y: e.clientY,
      });
    },
    [contextMenuDispatcher]
  );

  if (nodeType === 'folder') {
    return (
      <>
        <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
          <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
          <Folder />
          <Expander onToggled={toggleExpand} isExpanded={isExpanded} />
          {name}
        </div>
        {isExpanded &&
          data.children.map((childData) => <TreeNode key={childData.id} data={childData} level={level + 1} />)}
      </>
    );
  } else {
    return (
      <div onClick={selectNode} onContextMenu={openContextMenu} className={classStr}>
        <span style={{ display: 'inline-block', width: `${level * 16}px` }}></span>
        <File />
        {name}
      </div>
    );
  }
});

const Folder = () => {
  return (
    <div style={{ width: '24px' }}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"></path>
        </g>
      </svg>
    </div>
  );
};

const File = () => {
  return (
    <div style={{ width: '24px' }}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M12.0001 12C10.0027 12 10.0017 12.4862 10.0001 13.3292L10.0001 13.3325C9.99834 14.2328 10.0001 14.5 12.0001 14.5C14.0001 14.5 14.0001 14.7055 14.0001 15.6667C14.0001 16.389 14.0001 17 12.0001 17M12.0001 12L14.0001 12M12.0001 12L12 11M12.0001 17H10.0001M12.0001 17L12 18"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"></path>
        </g>
      </svg>
    </div>
  );
};

export default TreeNode;
