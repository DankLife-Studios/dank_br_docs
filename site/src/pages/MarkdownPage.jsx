import { Navigate, useParams } from 'react-router-dom';
import DocPage from '../components/DocPage.jsx';
import { guides, resourceTitles } from '../content/manifest.js';
import { loadMarkdown } from '../content/loadMarkdown.js';

export function GuidePage({ guideId }) {
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return <Navigate to="/" replace />;

  let markdown;
  try {
    markdown = loadMarkdown(guide.file);
  } catch (err) {
    return (
      <main className="main-column">
        <div className="doc-error">{String(err.message || err)}</div>
      </main>
    );
  }

  return (
    <DocPage
      kicker="Guide"
      title={guide.title}
      hideTitle
      markdown={markdown}
      currentFile={guide.file}
    />
  );
}

export function ResourcePage() {
  const { name } = useParams();
  const file = `resources/${name}.md`;
  const title = resourceTitles[name];

  if (!title) {
    return <Navigate to="/" replace />;
  }

  let markdown;
  try {
    markdown = loadMarkdown(file);
  } catch (err) {
    return (
      <main className="main-column">
        <div className="doc-error">{String(err.message || err)}</div>
      </main>
    );
  }

  return (
    <DocPage
      kicker="Resource"
      title={title}
      hideTitle
      markdown={markdown}
      currentFile={file}
    />
  );
}

export function OverviewPage() {
  return <GuidePage guideId="overview" />;
}

export function CommandsPage() {
  return <GuidePage guideId="commands" />;
}

export function DependenciesPage() {
  return <GuidePage guideId="dependencies" />;
}
