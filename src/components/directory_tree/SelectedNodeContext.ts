import { createContext } from 'react';

export const SelectedNodeContext = createContext<{
  selectedNode: string;
  setSelectedNode: React.Dispatch<React.SetStateAction<string>>;
} | null>(null);
