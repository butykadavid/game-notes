import { useRouter } from 'next/router'
import { getOvrRating, getColor } from '../public/functions'
import { redirectToPage } from '../public/functions'

import { PiGameControllerFill } from "react-icons/pi";

import styles from '../styles/homepage/review.module.css'

export default function ReviewCard({ review, hasLabel, hasTitle, deleteButton, fillParentForm }) {

    const router = useRouter()

    const ovr = getOvrRating(review)

    return (
        <div className={styles.card} onClick={() => redirectToPage(router, `/games/${review.title}`, { title: `${review.title}` })}>
            <div className={styles.card__image}><h1><PiGameControllerFill /></h1></div>

            <div className={styles.card__mid}>
                <h1 className={styles.card__title}>{review.title}</h1>

                {hasLabel && <p className={styles.card__user}>by {review.userName}</p>}
            </div>


            <h1 className={styles.card__score} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>

        </div>
    )
}