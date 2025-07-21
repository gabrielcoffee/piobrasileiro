import React from 'react';
import styles from './styles/PageTitle.module.css';

interface PageTitleProps {
  icon: React.ReactNode;
  title: string;
  text: React.ReactNode;
}

export function PageTitle({ icon, title, text }: PageTitleProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          {icon}
        </div>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <p className={styles.text}>{text}</p>
    </div>
  );
} 