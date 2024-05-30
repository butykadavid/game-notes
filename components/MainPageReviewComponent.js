import { useRouter } from 'next/router'
import { getOvrRating, getColor } from '../public/functions'
import { redirectToPage } from '../public/functions'

import styles from '../styles/homepage/review.module.css'

export default function MainPageReview({ game }) {

    const router = useRouter()

    const ovr = getOvrRating(game)

    return (
        <div className={styles.card} onClick={() => redirectToPage(router, `/games/${game.title}`, { title: `${game.title}` })}>
            <div className={styles.card__image} style={{
                background: `url(${game.img})`,
                backgroundPosition: `center`,
                backgroundSize: `cover`,
            }}></div>

            <div className={styles.card__mid}>
                <h1 className={styles.card__title}>{game.title}</h1>

                <p className={styles.card__user}>by {game.userName}</p>
            </div>


            <h1 className={styles.card__score} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>

        </div>
    )
}