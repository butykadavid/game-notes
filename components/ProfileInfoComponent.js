import { getDateFromTimestamp, getFormattedDate } from '../public/functions'
import styles from '../styles/profilepage/profileCard.module.css'
import MainPageReview from './MainPageReviewComponent'

export default function ProfileInfo({ user, reviewCount, playtime, platinums, avgRating, bestRatedGame }) {

    return (
        <div className={styles.profile__wrapper}>

            <div className={styles.card}>
                <div className={styles.card__profile__main}>
                    <div className={styles.profile__pic} style={{
                        background: `url(${user.image})`,
                        backgroundPosition: `center`,
                        backgroundSize: `cover`
                    }}></div>

                    <div className={styles.profile__name}>
                        <h1>{user.name}</h1>
                        <p>Joined: {getFormattedDate(getDateFromTimestamp(Math.floor(user.createdAt / 1000)))}</p>
                    </div>
                </div>
            </div>

            <div className={styles.info__box}>
                <div className={styles.box__label}>
                    <h5>Statistics</h5>
                </div>
                <h4><span>{reviewCount}</span> reviews</h4>
                <h4><span>{playtime}</span> hours playtime</h4>
                <h4><span>{platinums}</span> platinums</h4>
                <h4><span>{avgRating}</span> average rating</h4>
            </div>

            <div className={`${styles.info__box} ${styles.info__box__review}`}>
                <div className={styles.box__label}>
                    <h5>Highest rated</h5>
                </div>
                <div className={styles.dummy}></div>
                {bestRatedGame != null ?
                    <MainPageReview game={bestRatedGame} displayName={''} />
                    :
                    <h4>No reviews available</h4>
                }
            </div>

        </div>)
}
