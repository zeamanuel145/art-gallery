'use client';

import React, { useState, useRef, useEffect } from "react";
import styles from "./FAQ.module.css";

type QA = {
  q: string;
  a: React.ReactNode;
};

const faqs: QA[] = [
  {
    q: "What types of art do you feature?",
    a: (
      <>
        We feature a wide range of traditional Ethiopian arts, including paintings, crafts, pottery, textiles, and religious icons. Our collection represents the diverse cultural heritage of Ethiopia, with both contemporary and historical pieces sourced directly from local artisans and trusted galleries.
      </>
    ),
  },
  {
    q: "How can I sell my art on BRANA Arts?",
    a: (
      <>
        To sell on BRANA Arts you can create an artist account, complete your profile, and submit listings for approval. Steps:
        <ol>
          <li>Create an account and verify your email.</li>
          <li>Complete your artist profile with bio and portfolio images.</li>
          <li>Go to "Sell" → "Create Listing", add photos, dimensions, materials, price and a short description.</li>
          <li>Submit the listing for review. Our team will verify authenticity and quality and publish it once approved.</li>
        </ol>
        We also offer seller resources (listing tips, shipping guidance, and pricing recommendations) to help you maximize visibility and sales.
      </>
    ),
  },
  {
    q: "What payment methods do you accept?",
    a: (
      <>
        We accept major international payment methods to make buying and selling easy and secure:
        <ul>
          <li>Credit / Debit Cards (Visa, MasterCard, Amex)</li>
          <li>PayPal</li>
          <li>Bank Transfers (selected regions)</li>
          <li>Mobile Money (available for selected local regions)</li>
        </ul>
        All payments are processed via secure, PCI-compliant providers. Sellers receive payouts via bank transfer or the payout method they select in their account settings.
      </>
    ),
  },
];

export default function FAQ() {
  // single open accordion (set to 0 to open first by default)
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // focus management for keyboard arrow navigation between headers
  useEffect(() => {
    headingsRef.current = headingsRef.current.slice(0, faqs.length);
  }, []);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const count = faqs.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (i + 1) % count;
      headingsRef.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (i - 1 + count) % count;
      headingsRef.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      headingsRef.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      headingsRef.current[count - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(i);
    }
  }

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.container}>
        <h2 id="faq-heading" className={styles.title}>
          Frequently Asked Questions
        </h2>

        <div className={styles.list} role="region" aria-label="Frequently asked questions">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;

            return (
              <div className={styles.item} key={i}>
                <h3 className={styles.h}>
                  <button
                    id={btnId}
                    ref={(el) => {
                      headingsRef.current[i] = el;
                    }}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className={`${styles.button} ${isOpen ? styles.open : ""}`}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                  >
                    <span className={styles.qText}>{item.q}</span>

                    {/* chevron */}
                    <svg
                      className={styles.chev}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
                  style={{ ["--max" as any]: isOpen ? "1000px" : "0px" }}
                >
                  <div className={styles.panelInner}>{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}