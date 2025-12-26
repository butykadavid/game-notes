import { useRouter } from 'next/router';
import { getDateFromTimestamp, getFormattedDate } from '../../public/functions'
import styles from '../../styles/homepage/user.module.css'
import { redirectToPage } from '../../public/functions';

export default function MainPageUser({ user }) {

    const router = useRouter()

    const date = getDateFromTimestamp(Math.floor(user.createdAt / 1000))
    const formattedDate = getFormattedDate(date)

    return (
        <div className={styles.card} onClick={() => redirectToPage(router, `/profiles/${user.uid}`, {
            uid: user.uid,
            createdAt: user.createdAt,
            image: user.image,
            name: user.name
        })}>
            
            <div className={styles.card__image} style={{
                background: `url(${user.image})`,
                backgroundPosition: `center`,
                backgroundSize: `cover`
            }}>

            </div>

            <div className={styles.card__mid}>
                <h1 className={styles.card__title}>{user.name}</h1>

                <p className={styles.card__user}>joined {formattedDate}</p>
            </div>

        </div>
    )
}