// Server component: highlighting runs at render time on the server so code
// content and sugar-high never ship in the client bundle. The only interactive
// piece is the CopyButton client island.

import { highlight } from 'sugar-high';
import { MermaidDiagram } from './MermaidDiagram';
import { CopyButton } from './CopyButton';
import styles from './CodeBlock.module.css';

type Props = {
  lang?: string;
  rawCode?: string;
};

export function CodeBlock({ lang = 'code', rawCode = '' }: Props) {
  if (lang === 'mermaid') {
    return <MermaidDiagram chart={rawCode} />;
  }

  const highlighted = highlight(rawCode);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{lang}</span>
        <CopyButton rawCode={rawCode} />
      </div>

      <pre className={styles.codePre}>
        <code className={styles.codeMono} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
