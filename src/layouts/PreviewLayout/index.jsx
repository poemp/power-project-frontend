import React from 'react';
import styles from './index.module.scss';

export default function PreviewLayout({children}) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
