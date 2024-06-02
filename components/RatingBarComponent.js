import styles from '../styles/ratingBar.module.css'

export default function RatingBarComponent({ rating, color, border }) {

    const keyframes = `
        @keyframes loadIn {
            from { width: 0px; }
            to { width: ${rating}%; }
        }`;

    const barStyle = {
        width: `${rating}%`,
        backgroundColor: `${color}`,
        animation: 'loadIn 0.75s ease-in-out',
        WebkitAnimation: 'loadIn 0.75s ease-in-out',
    };

    return (

        <div className={styles.main__bar} style={border ? { border: `1px solid rgba(255, 255, 255, 0.1)` } : {}}>

            <div className={styles.rating__label} style={{ left: `${rating}%`, transform: `translateX(-50%)` }}>
                <h1>{rating}</h1>
            </div>

            <style>{keyframes}</style>

            <div className={styles.color__bar} style={barStyle}>

                <div className={styles.marker}></div>

            </div>

        </div>

    )
}