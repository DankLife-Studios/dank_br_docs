import { Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import HomePage from './pages/HomePage.jsx';
import {
  CommandsPage,
  DependenciesPage,
  OverviewPage,
  ResourcePage,
} from './pages/MarkdownPage.jsx';
import { assertManifestContent } from './content/loadMarkdown.js';

assertManifestContent();

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<HomePage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="commands" element={<CommandsPage />} />
        <Route path="dependencies" element={<DependenciesPage />} />
        <Route path="resources/:name" element={<ResourcePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
