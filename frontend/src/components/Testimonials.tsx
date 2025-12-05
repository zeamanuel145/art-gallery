import React from "react";
import Image from "next/image";
import styles from "./Testimonials.module.css";

type Testimonial = {
  quote: string;
  author: string;
  avatar?: string; // path in /public, optional
};

const testimonials: Testimonial[] = [
  {
    quote:
      "BRANA Arts helped me sell my first painting to a collector abroad. It's more than a platform — it's a family of artists.",
    author: "Hanna M., Addis Ababa",
    avatar: "/assets/hanna.jpg",
  },
  {
    quote:
      "I discovered stunning handmade crafts from the South that revived a lot of my childhood memories. Beautiful and authentic.",
    author: "Daniel L., Bahir Dar",
    avatar: "/assets/danniel.jpg",
  },
  {
    quote:
      "This platform keeps our culture alive — I'm proud to promote Ethiopian creativity through BRANA.",
    author: "Selam T., Lalibela",
    avatar: "/assets/selam.jpg",
  },
];

const Stars: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className={styles.stars} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.star}>
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="testimonials-heading" className={styles.title}>
            Testimonials
          </h2>
          <p className={styles.lead}>Hear from our community of artists and art lovers.</p>
        </header>

        <div className={styles.grid} role="list" aria-label="Testimonials list">
          {testimonials.map((t, idx) => (
            <article className={styles.card} key={idx} role="listitem" aria-label={`Testimonial by ${t.author}`}>
              {/* small circle avatar above the text */}
              <div className={styles.avatarWrap}>
                {t.avatar ? (
                  <Image
                    src={t.avatar}
                    alt={`${t.author} avatar`}
                    width={36}
                    height={36}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder} aria-hidden />
                )}
              </div>

              <div className={styles.cardBody}>
                <Stars />
                <blockquote className={styles.quote}>"{t.quote}"</blockquote>
                <cite className={styles.author}>— {t.author}</cite>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;