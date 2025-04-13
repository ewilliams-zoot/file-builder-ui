import DirectoryTree from './components/directory_tree/DirectoryTree';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContextMenuProvider from './components/context_menu/ContextMenuProvider';
import ContextMenu from './components/context_menu/ContextMenu';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextMenuProvider>
        <DirectoryTree />
        <ContextMenu />
      </ContextMenuProvider>
    </QueryClientProvider>
  );
}

export default App;
