import { useState } from 'react';
import QuickStartGuide from './QuickStartGuide';
import Faq from './Faq';
import styles from '../styles/HelpNav.module.css';

const HelpNav = ({ currentLanguage = 'javascript' }) => {
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  return (
    <>
      <div className={styles.helpNavContainer}>
        <button 
          className={styles.helpButton} 
          onClick={() => setShowQuickStart(true)}
          aria-label="快速入门指南"
        >
          <span className={styles.helpIcon}>📚</span>
          <span className={styles.helpText}>快速入门</span>
        </button>
        <button 
          className={styles.helpButton} 
          onClick={() => setShowFaq(true)}
          aria-label="常见问题"
        >
          <span className={styles.helpIcon}>❓</span>
          <span className={styles.helpText}>常见问题</span>
        </button>
      </div>

      {/* 快速入门指南 */}
      <QuickStartGuide 
        language={currentLanguage}
        isOpen={showQuickStart}
        onClose={() => setShowQuickStart(false)}
      />

      {/* 常见问题 */}
      <Faq
        isOpen={showFaq}
        onClose={() => setShowFaq(false)}
      />
    </>
  );
};

export default HelpNav;
