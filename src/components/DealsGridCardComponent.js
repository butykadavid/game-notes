import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { normalizeGameTitle, redirectToPage } from '@/lib/functions';
import styles from '../../styles/deals-card.module.css';
import logo from '../../public/logo.png';
import googleLogo from '../../public/google_logo.svg';

import RatingBarComponent from './RatingBarComponent';

export default function DealsGridCardComponent({ game }) {
  const router = useRouter();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideOptions = optionsRef.current && !optionsRef.current.contains(event.target);
      const clickedOutsideButton = buttonRef.current && !buttonRef.current.contains(event.target);

      if (clickedOutsideOptions && clickedOutsideButton) {
        setOptionsOpen(false);
      }
    };

    if (optionsOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [optionsOpen]);

  const searchTitle = normalizeGameTitle(game.title);
  const googleSearch = game.title.split(' ').join('+');

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          src={'https:' + game.image}
          alt={`${game.title} cover art`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <RatingBarComponent rating={game.ovrRating * 20} aspectRatio={"24/1"} border={true} />

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3>{game.title}</h3>
        </div>
        {/* <p>Overall rating from the existing Game Pass feed.</p> */}
      </div>

      <div className={styles.actions}>
        <button
          ref={buttonRef}
          type="button"
          className={styles.optionsButton}
          aria-expanded={optionsOpen}
          aria-label={`Open options for ${game.title}`}
          onClick={() => setOptionsOpen((value) => !value)}
        >
          ⋮
        </button>

        {optionsOpen && (
          <div ref={optionsRef} className={styles.optionsMenu}>
            <button type="button" className={styles.optionItem} onClick={() => redirectToPage(router, '/games', { searchWord: searchTitle })}>
              <span className={styles.optionIcon}>
                <Image src={logo} alt="GameNotes" width={"auto"} height={18} />
              </span>
              GameNotes search
            </button>

            <button type="button" className={styles.optionItem}>
              <Link className={styles.optionItemLink} href={`https://google.com/search?q=${googleSearch}`} target="_blank" rel="noreferrer">
                <span className={styles.optionIcon}>
                  <Image src={googleLogo} alt="Google" width={16} height={16} />
                </span>
                Google search
              </Link>
            </button>

            <button type="button" className={styles.optionItem} onClick={() => redirectToPage(router, '/dashboard', { createReviewTitle: normalizeGameTitle(game.title) })}>
              <span className={styles.newBadge}>+</span>
              Write review
            </button>
          </div>
        )}
      </div>
    </article>
  );
}