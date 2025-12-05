import React from "react";
import Image from "next/image";
import styles from "./Collection.module.css";

type Card = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

const cards: Card[] = [
  {
    src: "/cards/paint.jpg",
    alt: "Traditional Ethiopian painting with historical scene",
    title: "Traditional Painting",
    description:
      "A vibrant painting depicting a historical scene from Ethiopian history.",
  },
  {
    src: "/cards/pottery 1.jpg",
    alt: "Handcrafted terracotta pottery on wooden surface",
    title: "Handcrafted Pottery",
    description:
      "Beautifully crafted pottery showcasing traditional patterns and designs.",
  },
  {
    src: "/cards/basket.jpg",
    alt: "Handwoven basket placed on table",
    title: "Woven Baskets",
    description:
      "Intricately woven baskets, perfect for decoration or practical use.",
  },
  {
    src: "/cards/tibeb 2.jpg",
    alt: "Traditional Ethiopian textile",
    title: "Traditional Textiles",
    description:
      "Beautiful traditional Ethiopian textiles with intricate patterns and designs.",
  },
];

const Collection: React.FC = () => {
  return (
    <section className={`${styles.section} py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8`} aria-labelledby="collection-heading">
      <div className={`${styles.container} max-w-6xl mx-auto`}>
        <h2 id="collection-heading" className={`${styles.heading} text-2xl sm:text-3xl lg:text-4xl text-center mb-8 sm:mb-12`}>
          Explore Our Collection
        </h2>

        <div className={`${styles.grid} grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center`} role="list">
          {cards.map((card, index) => (
            <article className={`${styles.card} bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm mx-auto md:max-w-none ${index % 2 === 0 ? 'animate-slideInLeft' : 'animate-slideInRight'}`} key={card.title} role="listitem">
              <div className={`${styles.media} relative aspect-[4/3] w-full`}>
                {/* Using fill to cover the card area; container provides aspect ratio */}
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 480px) 90vw, (max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                  style={{ objectFit: "cover" }}
                  priority={false}
                  className="rounded-t-lg"
                />
              </div>

              <div className={`${styles.content} p-3 xs:p-4 sm:p-5 lg:p-6`}>
                <h3 className={`${styles.cardTitle} text-base xs:text-lg sm:text-xl font-semibold mb-2`}>{card.title}</h3>
                <p className={`${styles.cardDesc} text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed`}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;