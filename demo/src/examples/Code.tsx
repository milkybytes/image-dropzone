import { Highlight, themes } from 'prism-react-renderer';
import styles from '../App.module.css';

export default function Code({ children }: { children: string }) {
  return (
    <div className={styles.codeBlock}>
      <Highlight theme={themes.nightOwl} code={children.trim()} language="tsx">
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, background: 'transparent', margin: 0, padding: 0, overflowX: 'auto' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
