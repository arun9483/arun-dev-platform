import type { ReactElement } from 'react';

type ScriptProps = {
  id?: string;
  strategy?: string;
  dangerouslySetInnerHTML?: { __html: string };
  children?: React.ReactNode;
};

const Script = ({ id, dangerouslySetInnerHTML }: ScriptProps): ReactElement => (
  <script id={id} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
);

export default Script;
