import { useState } from 'react';
import Head from 'next/head';
import CodeGenerator from '../components/CodeGenerator';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>CodeWhisper - 由DeepSeekAI驱动</title>
        <meta name="description" content="使用DeepSeekAI将您的想法转化为高质量代码" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          CodeWhisper
        </h1>
        
        <div className={styles.powered}>
          Powered by DeepSeekAI
        </div>
        
        <p className={styles.description}>
          将您的<span className={styles.highlight}>想法</span>转变为<span className={styles.highlight}>应用</span>
        </p>

        <CodeGenerator />
      </main>

      <footer className={styles.footer}>
        <p>Powered by DeepSeekAI · 代码生成器</p>
      </footer>
    </div>
  );
}
