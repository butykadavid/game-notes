import styles from '../styles/ratingBar.module.css'

export default function RatingBarComponent({ rating, color, border }) {

    return (

        <div className={styles.main__bar} style={border ? { border: `1px solid rgba(255, 255, 255, 0.1)` } : {}}>

            <div className={styles.rating__label} style={{ left: `${rating}%`, transform: `translateX(-50%)` }}>
                <h1>{rating}</h1>
            </div>

            <div className={styles.color__bar} style={{
                width: `${rating}%`,
                backgroundColor: `${color}`
            }}>

                <div className={styles.marker}></div>

            </div>

        </div>

    )
}