import React from "react";
import styles from "./Mission.module.css";

const IconStack = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#DFA67A" />
    <path d="M3 11l9 5 9-5" stroke="#C88A55" strokeWidth="0.8" />
    <path d="M3 16l9 5 9-5" stroke="#C88A55" strokeWidth="0.8" />
  </svg>
);

const IconUser = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" fill="#DFA67A" />
    <path d="M20 21c0-3.866-3.582-7-8-7s-8 3.134-8 7" stroke="#C88A55" strokeWidth="0.9" />
  </svg>
);

const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2l7 3v5c0 5.5-3.9 10.7-7 12-3.1-1.3-7-6.5-7-12V5l7-3z" fill="#DFA67A" />
    <path d="M9 12l2 2 4-4" stroke="#C88A55" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Mission: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="mission-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="mission-heading" className={styles.title}>
            Our Mission and Values
          </h2>
          <p className={styles.lead}>
            At BRANA Arts, our mission is to build a global bridge to the heart of Ethiopian culture. We are guided by core values that shape every aspect of our work, from empowering local artisans to preserving the rich artistic traditions for future generations.
          </p>
        </header>

        <div className={styles.columns}>
          <article className={styles.card} aria-labelledby="our-mission-title">
            <h3 id="our-mission-title" className={styles.cardTitle}>Our Mission</h3>
            <p className={styles.cardText}>
              We are dedicated to providing a platform for Ethiopian artists to showcase their incredible talent and share their stories with the world. We strive to foster a vibrant community of artists, collectors, and enthusiasts who share a passion for beauty, heritage, and authentic craftsmanship, ensuring the preservation of Ethiopia's rich cultural legacy.
            </p>
          </article>

          <div className={styles.values} role="list" aria-label="Core values">
            <div className={styles.value} role="listitem">
              <div className={styles.iconWrap} aria-hidden>
                <span className={styles.iconBg}><IconStack /></span>
              </div>
              <div className={styles.valueContent}>
                <h4 className={styles.valueTitle}>Authenticity</h4>
                <p className={styles.valueText}>
                  We are committed to showcasing genuine Ethiopian art, ensuring every piece reflects the true spirit and heritage of its origin.
                </p>
              </div>
            </div>

            <div className={styles.value} role="listitem">
              <div className={styles.iconWrap} aria-hidden>
                <span className={styles.iconBg}><IconUser /></span>
              </div>
              <div className={styles.valueContent}>
                <h4 className={styles.valueTitle}>Empowerment</h4>
                <p className={styles.valueText}>
                  We empower local artists by providing a global stage for their work, ensuring fair compensation and recognition for their talent.
                </p>
              </div>
            </div>

            <div className={styles.value} role="listitem">
              <div className={styles.iconWrap} aria-hidden>
                <span className={styles.iconBg}><IconShield /></span>
              </div>
              <div className={styles.valueContent}>
                <h4 className={styles.valueTitle}>Preservation</h4>
                <p className={styles.valueText}>
                  We are dedicated to preserving the rich cultural legacy of Ethiopia by fostering appreciation for traditional art forms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;