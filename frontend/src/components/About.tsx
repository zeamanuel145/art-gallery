import React from "react";
import Image from "next/image";
import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <section className={`${styles.about} py-8 xs:py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8`} aria-labelledby="about-heading">
      <div className={`${styles.inner} flex flex-col md:flex-row items-start gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto`}>
        <div className={`${styles.left} flex-1 text-center md:text-left px-2 sm:px-0`}>
          <h2 id="about-heading" className={`${styles.title} text-xl xs:text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 leading-tight animate-slideInLeft`}>
            About BRANA Arts
          </h2>

          <p className={`${styles.lead} text-sm xs:text-base sm:text-base lg:text-lg leading-relaxed max-w-prose mx-auto md:mx-0 animate-fadeInUp`}>
            BRANAArts is a platform dedicated to showcasing and preserving the vibrant artistic heritage of Ethiopia. We connect artists with art enthusiasts, providing a space to buy, sell, and promote traditional Ethiopian arts, paintings, and crafts. Our mission is to celebrate the cultural richness of Ethiopia and empower artists to share their creations with the world.
          </p>
        </div>

        <div className={`${styles.divider} hidden md:block`} aria-hidden="true" />

        <figure className={`${styles.right} flex-none`}>
          <Image
            src="/assets/about us.jpg"
            alt="Traditional Ethiopian art"
            width={450}
            height={300}
            className={`${styles.image} rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer animate-slideInRight`}
            priority
            style={{ width: '450px', height: '300px', objectFit: 'cover' }}
          />
        </figure>
      </div>
    </section>
  );
};

export default About;